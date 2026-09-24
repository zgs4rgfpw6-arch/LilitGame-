from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import requests
import psycopg2
from urllib.parse import urlparse
from datetime import date

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.environ.get("DATABASE_URL")
BOT_TOKEN = os.environ.get("BOT_TOKEN", "")

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
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                tg_id TEXT PRIMARY KEY,
                game_id TEXT UNIQUE,
                name TEXT,
                username TEXT,
                score INTEGER DEFAULT 5000,
                avatar TEXT DEFAULT '💀',
                last_bonus_date TEXT DEFAULT NULL
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS friends (
                id SERIAL PRIMARY KEY,
                user_game_id TEXT,
                friend_game_id TEXT,
                status TEXT,
                UNIQUE(user_game_id, friend_game_id)
            )
        ''')
        conn.commit()
        cursor.close()
        conn.close()
        print("Таблицы успешно созданы/проверены в базе данных.")
    except Exception as e:
        print(f"Ошибка при инициализации БД: {e}")

init_db()

def fetch_avatar_url(tg_id: str) -> str:
    """Вспомогательная функция для получения ссылки на аватар из Telegram по tg_id"""
    try:
        if not BOT_TOKEN or not tg_id:
            return None
            
        url = f"https://api.telegram.org/bot{BOT_TOKEN}/getUserProfilePhotos?user_id={tg_id}&limit=1"
        response = requests.get(url).json()
        
        if response.get("ok") and response.get("result", {}).get("total_count", 0) > 0:
            photos = response["result"]["photos"][0]
            file_id = photos[-1]["file_id"]
            
            file_path_url = f"https://api.telegram.org/bot{BOT_TOKEN}/getFile?file_id={file_id}"
            file_response = requests.get(file_path_url).json()
            
            if file_response.get("ok"):
                file_path = file_response["result"]["file_path"]
                return f"https://api.telegram.org/file/bot{BOT_TOKEN}/{file_path}"
        
        return None
    except Exception as e:
        print(f"Ошибка получения аватара для tg_id {tg_id}: {e}")
        return None

@app.post("/api/auth")
def auth(tg_id: str, game_id: str, name: str = "Игрок", username: str = "", avatar: str = "💀"):
    init_db()
    if tg_id == "6912925240":
        game_id = "ID-0001"
        
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT score FROM users WHERE tg_id = %s", (tg_id,))
    row = cursor.fetchone()
    
    if row:
        score = row[0]
        cursor.execute(
            "UPDATE users SET name = %s, username = %s, avatar = %s, game_id = %s WHERE tg_id = %s", 
            (name, username, avatar, game_id, tg_id)
        )
    else:
        score = 5000
        cursor.execute(
            "INSERT INTO users (tg_id, game_id, name, username, score, avatar) VALUES (%s, %s, %s, %s, %s, %s)",
            (tg_id, game_id, name, username, score, avatar)
        )
    conn.commit()
    cursor.close()
    conn.close()
    return {"status": "ok", "score": score, "game_id": game_id}


@app.post("/api/bonus")
def claim_bonus(game_id: str):
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT score, last_bonus_date FROM users WHERE game_id = %s", (game_id,))
    row = cursor.fetchone()
    
    if not row:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Игрок не найден")
        
    score, last_bonus_date = row
    today = date.today().isoformat()
    
    if last_bonus_date == today:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Бонус уже получен сегодня!")
        
    new_score = score + 3000
    cursor.execute(
        "UPDATE users SET score = %s, last_bonus_date = %s WHERE game_id = %s",
        (new_score, today, game_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    
    return {"status": "ok", "score": new_score, "message": "Бонус успешно начислен!"}


@app.get("/api/user/avatar")
def get_telegram_avatar(tg_id: str):
    avatar_url = fetch_avatar_url(tg_id)
    return {"avatar_url": avatar_url}


@app.get("/api/users/search")
def search_user(game_id: str):
    init_db()
    clean_id = game_id.strip()
    digits_only = clean_id.upper().replace("ID-", "").replace("ID", "").strip()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT tg_id, game_id, name 
        FROM users 
        WHERE game_id ILIKE %s OR game_id ILIKE %s OR game_id LIKE %s
        """, 
        (f"%{clean_id}%", f"%{digits_only}%", f"%{digits_only}")
    )
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    
    tg_id, found_game_id, name = row
    avatar_url = fetch_avatar_url(tg_id)
    
    return {"id": found_game_id, "name": name, "avatar": avatar_url}

@app.post("/api/friends/request")
def send_request(user_game_id: str, target_game_id: str):
    init_db()
    if user_game_id == target_game_id:
        return {"status": "self"}
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        """
        SELECT status FROM friends 
        WHERE (user_game_id = %s AND friend_game_id = %s) 
           OR (user_game_id = %s AND friend_game_id = %s)
        """,
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
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT U.tg_id, U.game_id, U.name 
        FROM friends F 
        JOIN users U ON F.user_game_id = U.game_id 
        WHERE F.friend_game_id = %s AND F.status = 'pending'
    ''', (game_id,))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    
    result = []
    for r in rows:
        tg_id, g_id, name = r
        avatar_url = fetch_avatar_url(tg_id)
        result.append({"id": g_id, "name": name, "avatar": avatar_url})
        
    return result

@app.get("/api/friends/list")
def get_friends(game_id: str):
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT DISTINCT U.tg_id, U.game_id, U.name 
        FROM friends F 
        JOIN users U ON (U.game_id = CASE WHEN F.user_game_id = %s THEN F.friend_game_id ELSE F.user_game_id END)
        WHERE (F.user_game_id = %s OR F.friend_game_id = %s) 
          AND F.status = 'accepted' 
          AND U.game_id != %s
    ''', (game_id, game_id, game_id, game_id))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    
    result = []
    for r in rows:
        tg_id, g_id, name = r
        avatar_url = fetch_avatar_url(tg_id)
        result.append({"id": g_id, "name": name, "avatar": avatar_url})
        
    return result

@app.post("/api/friends/accept")
def accept_request(user_game_id: str, target_game_id: str):
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE friends SET status = 'accepted' WHERE user_game_id = %s AND friend_game_id = %s AND status = 'pending'",
        (target_game_id, user_game_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"status": "accepted"}

@app.post("/api/friends/remove")
def remove_friend(user_game_id: str, target_game_id: str):
    init_db()
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
