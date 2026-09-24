from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

app = FastAPI(title="Lilit Casino API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "database.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tg_id TEXT UNIQUE,
            game_id TEXT UNIQUE,
            username TEXT,
            name TEXT,
            score INTEGER DEFAULT 500
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS friendships (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_game_id TEXT,
            friend_game_id TEXT,
            status TEXT DEFAULT 'pending'
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.get("/")
def read_root():
    return {"status": "ok", "project": "Lilit Casino API"}

@app.post("/api/auth")
def auth_user(tg_id: str, game_id: str, name: str, username: str = ""):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT tg_id, game_id, name, score FROM users WHERE tg_id = ?", (tg_id,))
    user = cursor.fetchone()
    
    if not user:
        cursor.execute("INSERT INTO users (tg_id, game_id, name, username, score) VALUES (?, ?, ?, ?, ?)", 
                       (tg_id, game_id, name, username, 500))
        conn.commit()
        cursor.execute("SELECT tg_id, game_id, name, score FROM users WHERE tg_id = ?", (tg_id,))
        user = cursor.fetchone()
        
    conn.close()
    return {"tg_id": user[0], "game_id": user[1], "name": user[2], "score": user[3]}

@app.get("/api/users/search")
def search_user(game_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    search_query = game_id.strip().upper()
    if search_query.isdigit():
        search_query = f"ID-{search_query}"
        
    cursor.execute("SELECT game_id, name FROM users WHERE game_id = ?", (search_query,))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        raise HTTPException(status_code=404, detail="Игрок не найден")
    return {"id": user[0], "name": user[1], "avatar": "👤"}

@app.post("/api/friends/request")
def send_request(user_game_id: str, target_game_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, status FROM friendships 
        WHERE (user_game_id = ? AND friend_game_id = ?) 
           OR (user_game_id = ? AND friend_game_id = ?)
    """, (user_game_id, target_game_id, target_game_id, user_game_id))
    existing = cursor.fetchone()
    
    if existing:
        conn.close()
        return {"status": "already_exists"}

    cursor.execute("INSERT INTO friendships (user_game_id, friend_game_id, status) VALUES (?, ?, 'pending')", 
                   (user_game_id, target_game_id))
    conn.commit()
    conn.close()
    return {"status": "success"}

@app.get("/api/friends/requests")
def get_friend_requests(game_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT f.id, u.game_id, u.name 
        FROM friendships f
        JOIN users u ON f.user_game_id = u.game_id
        WHERE f.friend_game_id = ? AND f.status = 'pending'
    """, (game_id,))
    rows = cursor.fetchall()
    conn.close()
    
    requests_list = [{"id": row[1], "name": row[2], "avatar": "👤"} for row in rows]
    return requests_list

@app.post("/api/friends/accept")
def accept_friend_request(user_game_id: str, target_game_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Меняем статус заявки с 'pending' на 'accepted' (запрос мог быть отправлен от target к user)
    cursor.execute("""
        UPDATE friendships 
        SET status = 'accepted' 
        WHERE (user_game_id = ? AND friend_game_id = ?) 
           OR (user_game_id = ? AND friend_game_id = ?)
    """, (target_game_id, user_game_id, user_game_id, target_game_id))
    conn.commit()
    conn.close()
    return {"status": "success"}

@app.post("/api/friends/remove")
def remove_friend(user_game_id: str, target_game_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Удаляем запись о дружбе или отклоненном запросе между двумя игроками
    cursor.execute("""
        DELETE FROM friendships 
        WHERE (user_game_id = ? AND friend_game_id = ?) 
           OR (user_game_id = ? AND friend_game_id = ?)
    """, (user_game_id, target_game_id, target_game_id, user_game_id))
    conn.commit()
    conn.close()
    return {"status": "success"}

@app.get("/api/friends/list")
def get_friends(game_id: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Находим все подтвержденные связи, где текущий пользователь — либо отправитель, либо получатель
    cursor.execute("""
        SELECT f.id, 
               CASE WHEN f.user_game_id = ? THEN f.friend_game_id ELSE f.user_game_id END as friend_id
        FROM friendships f
        WHERE (f.user_game_id = ? OR f.friend_game_id = ?) AND f.status = 'accepted'
    """, (game_id, game_id, game_id))
    rows = cursor.fetchall()
    
    friends_list = []
    for row in rows:
        f_id = row[1]
        cursor.execute("SELECT game_id, name FROM users WHERE game_id = ?", (f_id,))
        friend_user = cursor.fetchone()
        if friend_user:
            friends_list.append({"id": friend_user[0], "name": friend_user[1], "avatar": "👤"})
            
    conn.close()
    return friends_list
