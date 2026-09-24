from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import psycopg2
from urllib.parse import urlparse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Получаем DATABASE_URL из переменных окружения Render
DATABASE_URL = os.environ.get("DATABASE_URL")

def get_db_connection():
    parsed_url = urlparse(DATABASE_URL)
    conn = psycopg2.connect(
        database=parsed_url.path[1:],
        user=parsed_url.username,
        password=parsed_url.password,
        host=parsed_url.hostname,
        port=parsed_url.port,
        sslmode='require'
    )
    return conn

def init_db():
    if not DATABASE_URL:
        print("DATABASE_URL не задана!")
        return
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            tg_id TEXT PRIMARY KEY,
            game_id TEXT UNIQUE,
            name TEXT,
            username TEXT,
            score INTEGER DEFAULT 100,
            avatar TEXT DEFAULT '💀'
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS friends (
            user_game_id TEXT,
            friend_game_id TEXT,
            status TEXT,
            PRIMARY KEY (user_game_id, friend_game_id)
        )
    ''')
    conn.commit()
    cursor.close()
    conn.close()

init_db()

@app.post("/api/auth")
def auth(tg_id: str, game_id: str, name: str = "Игрок", username: str = "", avatar: str = "💀"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT score FROM users WHERE tg_id = %s", (tg_id,))
    row = cursor.fetchone()
    
    if row:
        score = row[0]
        cursor.execute("UPDATE users SET name = %s, username = %s, avatar = %s WHERE tg_id = %s", (name, username, avatar, tg_id))
    else:
        score = 100
        cursor.execute(
            "INSERT INTO users (tg_id, game_id, name, username, score, avatar) VALUES (%s, %s, %s, %s, %s, %s)",
            (tg_id, game_id, name, username, score, avatar)
        )
    conn.commit()
    cursor.close()
    conn.close()
    return {"status": "ok", "score": score}

@app.get("/api/users/search")
def search_user(game_id: str):
    clean_id = game_id.strip()
    
    # Делаем поиск гибким: проверяем и введенный вариант, и вариант с добавлением/удалением "ID-"
    if clean_id.upper().startswith("ID-"):
        search_val_1 = clean_id
        search_val_2 = clean_id.replace("ID-", "").replace("id-", "")
    else:
        search_val_1 = clean_id
        search_val_2 = f"ID-{clean_id}"

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT game_id, name, avatar FROM users WHERE game_id = %s OR game_id = %s OR game_id ILIKE %s", 
        (search_val_1, search_val_2, f"%{clean_id}%")
    )
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"id": row[0], "name": row[1], "avatar": row[2]}


@app.post("/api/friends/request")
def send_request(user_game_id: str, target_game_id: str):
    if user_game_id == target_game_id:
        return {"status": "self"}
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT status FROM friends WHERE (user_game_id = %s AND friend_game_id = %s) OR (user_game_id = %s AND friend_game_id = %s)",
        (user_game_id, target_game_id, target_game_id, user_game_id)
    )
    existing = cursor.fetchone()
    if existing:
        cursor.close()
        conn.close()
        return {"status": "already_exists"}
        
    cursor.execute(
        "INSERT INTO friends (user_game_id, friend_game_id, status) VALUES (%s, %s, 'pending')",
        (user_game_id, target_game_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"status": "sent"}

@app.get("/api/friends/requests")
def get_requests(game_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT U.game_id, U.name, U.avatar 
        FROM friends F 
        JOIN users U ON F.user_game_id = U.game_id 
        WHERE F.friend_game_id = %s AND F.status = 'pending'
    ''', (game_id,))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return [{"id": r[0], "name": r[1], "avatar": r[2]} for r in rows]

@app.get("/api/friends/list")
def get_friends(game_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT U.game_id, U.name, U.avatar 
        FROM friends F 
        JOIN users U ON (F.friend_game_id = U.game_id OR F.user_game_id = U.game_id)
        WHERE (F.user_game_id = %s OR F.friend_game_id = %s) AND F.status = 'accepted' AND U.game_id != %s
    ''', (game_id, game_id, game_id))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return [{"id": r[0], "name": r[1], "avatar": r[2]} for r in rows]

@app.post("/api/friends/accept")
def accept_request(user_game_id: str, target_game_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE friends SET status = 'accepted' WHERE user_game_id = %s AND friend_game_id = %s",
        (target_game_id, user_game_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"status": "accepted"}

@app.post("/api/friends/remove")
def remove_friend(user_game_id: str, target_game_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM friends WHERE (user_game_id = %s AND friend_game_id = %s) OR (user_game_id = %s AND friend_game_id = %s)",
        (user_game_id, target_game_id, target_game_id, user_game_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"status": "removed"}
