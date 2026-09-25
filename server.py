from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import os
import requests
import psycopg2
from urllib.parse import urlparse
from datetime import date
import uuid
import random

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
    
@app.post("/api/user/update-score")
def update_score(game_id: str, new_score: int):
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT score FROM users WHERE game_id = %s", (game_id,))
    row = cursor.fetchone()
    
    if not row:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Игрок не найден")
        
    cursor.execute(
        "UPDATE users SET score = %s WHERE game_id = %s",
        (new_score, game_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    
    return {"status": "ok", "score": new_score}


# ==========================================
# ЛОГИКА ИГРЫ "ДУРАК"
# ==========================================

DURAK_TABLES = {}

class DurakTable:
    def __init__(self, table_id, creator_id, creator_name, max_players, bet, deck_size=36):
        self.table_id = table_id
        self.max_players = max_players
        self.bet = bet
        self.deck_size = int(deck_size)
        self.players = [{
            "id": creator_id,
            "name": creator_name,
            "cards": []
        }]
        self.status = "waiting"  # waiting, playing, finished
        self.deck = []
        self.trump_card = None
        self.table_cards = []  # Список пар [{"attack": {...}, "defense": {...}}]
        self.attacker_index = 0
        self.defender_index = 1

    def start_game(self):
        suits = ['♠', '♣', '♥', '♦']
        
        if self.deck_size == 24:
            ranks = ['9', '10', 'J', 'Q', 'K', 'A']
        elif self.deck_size == 52:
            ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
        else:  # по умолчанию 36
            ranks = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
            
        ranks_value = {r: i for i, r in enumerate(ranks)}
        
        deck = []
        for s in suits:
            for r in ranks:
                deck.append({"rank": r, "suit": s, "value": ranks_value[r]})
        
        random.shuffle(deck)
        self.deck = deck
        self.trump_card = self.deck[-1]
        
        for p in self.players:
            p["cards"] = [self.deck.pop() for _ in range(6)]
            
        self.status = "playing"
        self.attacker_index = 0
        self.defender_index = 1 if len(self.players) > 1 else 0

    def refill_hands(self):
        for i in range(len(self.players)):
            idx = (self.attacker_index + i) % len(self.players)
            player = self.players[idx]
            while len(player["cards"]) < 6 and len(self.deck) > 0:
                player["cards"].append(self.deck.pop())


@app.get("/api/durak/tables")
def get_durak_tables():
    open_tables = []
    for t_id, table in DURAK_TABLES.items():
        if table.status == "waiting":
            open_tables.append({
                "table_id": table.table_id,
                "host_name": table.players[0]["name"],
                "max_players": table.max_players,
                "players_count": len(table.players),
                "bet": table.bet,
                "deck_size": table.deck_size
            })
    return open_tables


@app.post("/api/durak/create")
def create_durak_table(game_id: str = Query(...), name: str = Query(...), max_players: int = Query(2), bet: int = Query(100), deck_size: int = Query(36)):
    table_id = "TBL-" + str(uuid.uuid4())[:6].upper()
    new_table = DurakTable(
        table_id=table_id,
        creator_id=game_id,
        creator_name=name,
        max_players=max_players,
        bet=bet,
        deck_size=deck_size
    )
    DURAK_TABLES[table_id] = new_table
    return {"status": "success", "table_id": table_id}


@app.post("/api/durak/join")
def join_durak_table(table_id: str = Query(...), game_id: str = Query(...), name: str = Query(...)):
    if table_id not in DURAK_TABLES:
        raise HTTPException(status_code=404, detail="Стол не найден")
    
    table = DURAK_TABLES[table_id]
    
    if table.status != "waiting":
        raise HTTPException(status_code=400, detail="Игра уже началась или завершена")
    
    if len(table.players) >= table.max_players:
        raise HTTPException(status_code=400, detail="Стол уже заполнен")
    
    if any(p["id"] == game_id for p in table.players):
        return {"status": "success", "message": "Уже в игре"}

    table.players.append({
        "id": game_id,
        "name": name,
        "cards": []
    })
    
    if len(table.players) == table.max_players:
        table.start_game()

    return {"status": "success", "table_id": table_id}


@app.get("/api/durak/state")
def get_durak_state(table_id: str = Query(...), game_id: str = Query(...)):
    if table_id not in DURAK_TABLES:
        raise HTTPException(status_code=404, detail="Стол не найден")
    
    table = DURAK_TABLES[table_id]
    
    player_data = next((p for p in table.players if p["id"] == game_id), None)
    if not player_data and table.status == "playing":
        raise HTTPException(status_code=403, detail="Вы не участник этого стола")

    opponents = [{"name": p["name"], "cards_count": len(p["cards"])} for p in table.players if p["id"] != game_id]
    
    is_my_turn = False
    is_attacker = False
    if table.status == "playing" and player_data:
        current_idx = table.players.index(player_data)
        if current_idx == table.attacker_index:
            is_my_turn = True
            is_attacker = True
        elif current_idx == table.defender_index:
            is_my_turn = True
            is_attacker = False

    status_msg = "Ожидание второго игрока..." if table.status == "waiting" else ("Ваш ход (Атака)" if is_attacker else "Ваш ход (Защита)")

    return {
        "status": table.status,
        "players_count": len(table.players),
        "max_players": table.max_players,
        "my_cards": player_data["cards"] if player_data else [],
        "opponents": opponents,
        "trump_card": table.trump_card,
        "deck_count": len(table.deck),
        "table_cards": table.table_cards,
        "is_my_turn": is_my_turn,
        "is_attacker": is_attacker,
        "status_message": status_msg
    }


@app.post("/api/durak/action")
def durak_action(table_id: str = Query(...), game_id: str = Query(...), card_index: int = Query(None), action_type: str = Query(None)):
    if table_id not in DURAK_TABLES:
        raise HTTPException(status_code=404, detail="Стол не найден")
    
    table = DURAK_TABLES[table_id]
    if table.status != "playing":
        raise HTTPException(status_code=400, detail="Игра не активна")
        
    player = next((p for p in table.players if p["id"] == game_id), None)
    if not player:
        raise HTTPException(status_code=403, detail="Игрок не найден за столом")
        
    p_index = table.players.index(player)

    if action_type == "bito":
        table.table_cards.clear()
        table.refill_hands()
        table.attacker_index = table.defender_index
        table.defender_index = (table.attacker_index + 1) % len(table.players)
        return {"status": "ok", "message": "Бито засчитано"}

    if action_type == "take":
        cards_to_take = []
        for pair in table.table_cards:
            cards_to_take.append(pair["attack"])
            if pair.get("defense"):
                cards_to_take.append(pair["defense"])
        player["cards"].extend(cards_to_take)
        table.table_cards.clear()
        table.refill_hands()
        table.attacker_index = (table.defender_index + 1) % len(table.players)
        table.defender_index = (table.attacker_index + 1) % len(table.players)
        return {"status": "ok", "message": "Карты взяты"}

    if card_index is None or card_index < 0 or card_index >= len(player["cards"]):
        raise HTTPException(status_code=400, detail="Неверный индекс карты")

    target_card = player["cards"][card_index]

    if p_index == table.attacker_index:
        if len(table.table_cards) > 0:
            matching = any(c["rank"] == target_card["rank"] for pair in table.table_cards for c in [pair["attack"], pair.get("defense")] if c)
            if not matching:
                raise HTTPException(status_code=400, detail="Нельзя подкидывать карту такого достоинства")
        
        player["cards"].pop(card_index)
        table.table_cards.append({"attack": target_card, "defense": None})
        return {"status": "ok", "action": "attack"}

    elif p_index == table.defender_index:
        open_pair = next((p for p in table.table_cards if not p.get("defense")), None)
        if not open_pair:
            raise HTTPException(status_code=400, detail="Нет карт для защиты")
            
        attack_card = open_pair["attack"]
        trump_suit = table.trump_card["suit"]

        can_beat = False
        if target_card["suit"] == attack_card["suit"] and target_card["value"] > attack_card["value"]:
            can_beat = True
        elif target_card["suit"] == trump_suit and attack_card["suit"] != trump_suit:
            can_beat = True

        if not can_beat:
            raise HTTPException(status_code=400, detail="Этой картой нельзя побить")

        player["cards"].pop(card_index)
        open_pair["defense"] = target_card
        return {"status": "ok", "action": "defend"}

    raise HTTPException(status_code=400, detail="Сейчас не ваш ход")
