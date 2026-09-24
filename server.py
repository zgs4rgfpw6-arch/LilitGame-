from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_db():
    conn = sqlite3.connect("lilit.db")
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
    conn.close()

init_db()

@app.post("/api/auth")
def auth(tg_id: str, game_id: str, name: str = "Игрок", username: str = ""):
    conn = sqlite3.connect("lilit.db")
    cursor = conn.cursor()
    cursor.execute("SELECT score FROM users WHERE tg_id = ?", (tg_id,))
    row = cursor.fetchone()
    
    if row:
        score = row[0]
        cursor.execute("UPDATE users SET name = ?, username = ? WHERE tg_id = ?", (name, username, tg_id))
    else:
        score = 100
        cursor.execute(
            "INSERT INTO users (tg_id, game_id, name, username, score) VALUES (?, ?, ?, ?, ?)",
            (tg_id, game_id, name, username, score)
        )
    conn.commit()
    conn.close()
    return {"status": "ok", "score": score}

@app.get("/api/users/search")
def search_user(game_id: str):
    conn = sqlite3.connect("lilit.db")
    cursor = conn.cursor()
    cursor.execute("SELECT game_id, name, avatar FROM users WHERE game_id = ?", (game_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"id": row[0], "name": row[1], "avatar": row[2]}

@app.post("/api/friends/request")
def send_request(user_game_id: str, target_game_id: str):
    if user_game_id == target_game_id:
        return {"status": "self"}
    
    conn = sqlite3.connect("lilit.db")
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT status FROM friends WHERE (user_game_id = ? AND friend_game_id = ?) OR (user_game_id = ? AND friend_game_id = ?)",
        (user_game_id, target_game_id, target_game_id, user_game_id)
    )
    existing = cursor.fetchone()
    if existing:
        conn.close()
        return {"status": "already_exists"}
        
    cursor.execute(
        "INSERT INTO friends (user_game_id, friend_game_id, status) VALUES (?, ?, 'pending')",
        (user_game_id, target_game_id)
    )
    conn.commit()
    conn.close()
    return {"status": "sent"}

@app.get("/api/friends/requests")
def get_requests(game_id: str):
    conn = sqlite3.connect("lilit.db")
    cursor = conn.cursor()
    cursor.execute('''
        SELECT U.game_id, U.name, U.avatar 
        FROM friends F 
        JOIN users U ON F.user_game_id = U.game_id 
        WHERE F.friend_game_id = ? AND F.status = 'pending'
    ''', (game_id,))
    rows = cursor.fetchall()
    conn.close()
    
    return [{"id": r[0], "name": r[1], "avatar": r[2]} for r in rows]

@app.get("/api/friends/list")
def get_friends(game_id: str):
    conn = sqlite3.connect("lilit.db")
    cursor = conn.cursor()
    cursor.execute('''
        SELECT U.game_id, U.name, U.avatar 
        FROM friends F 
        JOIN users U ON (F.friend_game_id = U.game_id OR F.user_game_id = U.game_id)
        WHERE (F.user_game_id = ? OR F.friend_game_id = ?) AND F.status = 'accepted' AND U.game_id != ?
    ''', (game_id, game_id, game_id))
    rows = cursor.fetchall()
    conn.close()
    
    return [{"id": r[0], "name": r[1], "avatar": r[2]} for r in rows]

@app.post("/api/friends/accept")
def accept_request(user_game_id: str, target_game_id: str):
    conn = sqlite3.connect("lilit.db")
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE friends SET status = 'accepted' WHERE user_game_id = ? AND friend_game_id = ?",
        (target_game_id, user_game_id)
    )
    conn.commit()
    conn.close()
    return {"status": "accepted"}

@app.post("/api/friends/remove")
def remove_friend(user_game_id: str, target_game_id: str):
    conn = sqlite3.connect("lilit.db")
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM friends WHERE (user_game_id = ? AND friend_game_id = ?) OR (user_game_id = ? AND friend_game_id = ?)",
        (user_game_id, target_game_id, target_game_id, user_game_id)
    )
    conn.commit()
    conn.close()
    return {"status": "removed"}
