// Клиентская логика для игры "Дурак" в LILIT CASINO
const API_URL = ""; // Если бэкенд на том же домене, оставляем пустым или указываем URL рендерера

let currentTableId = null;
let currentGameId = localStorage.getItem("game_id") || "ID-0001";
let currentName = localStorage.getItem("user_name") || "Игрок";
let pollingInterval = null;

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    // Проверяем, есть ли элементы для лобби или игры, и вешаем обработчики
    setupLobbyListeners();
});

function setupLobbyListeners() {
    const createBtn = document.getElementById("createTableBtn");
    if (createBtn) {
        createBtn.addEventListener("click", async () => {
            const deckSize = document.getElementById("deckSizeSelect")?.value || 36;
            const bet = document.getElementById("betInput")?.value || 100;
            
            try {
                const res = await fetch(`${API_URL}/api/durak/create?game_id=${currentGameId}&name=${encodeURIComponent(currentName)}&max_players=2&bet=${bet}&deck_size=${deckSize}`, {
                    method: "POST"
                });
                const data = await res.json();
                if (data.status === "success") {
                    currentTableId = data.table_id;
                    startPolling();
                    showGameScreen();
                }
            } catch (e) {
                console.error("Ошибка создания стола:", e);
            }
        });
    }
}

async function joinTable(tableId) {
    currentTableId = tableId;
    try {
        const res = await fetch(`${API_URL}/api/durak/join?table_id=${tableId}&game_id=${currentGameId}&name=${encodeURIComponent(currentName)}`, {
            method: "POST"
        });
        const data = await res.json();
        if (data.status === "success") {
            startPolling();
            showGameScreen();
        }
    } catch (e) {
        console.error("Ошибка подключения к столу:", e);
    }
}

function startPolling() {
    if (pollingInterval) clearInterval(pollingInterval);
    pollingInterval = setInterval(updateGameState, 1500);
    updateGameState(); // Первый запрос сразу
}

async function updateGameState() {
    if (!currentTableId) return;
    try {
        const res = await fetch(`${API_URL}/api/durak/state?table_id=${currentTableId}&game_id=${currentGameId}`);
        const state = await res.json();
        renderGame(state);
    } catch (e) {
        console.error("Ошибка получения состояния игры:", e);
    }
}

function renderGame(state) {
    // 1. Отрисовка противников (вверху)
    const opponentContainer = document.getElementById("opponentContainer");
    if (opponentContainer && state.opponents.length > 0) {
        const opp = state.opponents[0];
        opponentContainer.innerHTML = `
            <div class="opponent-card">
                <div class="opponent-name">${opp.name}</div>
                <div class="cards-count">🃏 ${opp.cards_count} карт</div>
            </div>
        `;
    }

    // 2. Отрисовка колоды и козыря (слева)
    const deckContainer = document.getElementById("deckContainer");
    if (deckContainer) {
        if (state.deck_count > 0 && state.trump_card) {
            deckContainer.innerHTML = `
                <div class="deck-pile">Остаток: ${state.deck_count}</div>
                <div class="trump-card card ${state.trump_card.suit === '♥' || state.trump_card.suit === '♦' ? 'red' : 'black'}">
                    ${state.trump_card.rank}${state.trump_card.suit}
                </div>
            `;
        } else {
            deckContainer.innerHTML = `<div class="deck-pile">Колода пуста</div>`;
        }
    }

    // 3. Отрисовка игрового стола (пары атака/защита)
    const tableContainer = document.getElementById("tableContainer");
    if (tableContainer) {
        tableContainer.innerHTML = "";
        state.table_cards.forEach(pair => {
            const pairDiv = document.createElement("div");
            pairDiv.className = "table-pair";
            
            const attColor = pair.attack.suit === '♥' || pair.attack.suit === '♦' ? 'red' : 'black';
            let html = `<div class="card ${attColor}">${pair.attack.rank}${pair.attack.suit}</div>`;
            
            if (pair.defense) {
                const defColor = pair.defense.suit === '♥' || pair.defense.suit === '♦' ? 'red' : 'black';
                html += `<div class="card ${defColor}">${pair.defense.rank}${pair.defense.suit}</div>`;
            } else {
                html += `<div class="card empty-slot">?</div>`;
            }
            pairDiv.innerHTML = html;
            tableContainer.appendChild(pairDiv);
        });
    }

    // 4. Отрисовка карт игрока (вручную)
    const myCardsContainer = document.getElementById("myCardsContainer");
    if (myCardsContainer) {
        myCardsContainer.innerHTML = "";
        state.my_cards.forEach(card => {
            const cardEl = document.createElement("div");
            const isRed = card.suit === '♥' || card.suit === '♦';
            cardEl.className = `card player-card ${isRed ? 'red' : 'black'}`;
            cardEl.innerHTML = `${card.rank}${card.suit}`;
            
            // Клик по карте для хода (атака или защита)
            cardEl.addEventListener("click", () => sendAction(state.is_my_turn, card));
            myCardsContainer.appendChild(cardEl);
        });
    }

    // 5. Управление кнопками (Бито / Взять)
    const actionPanel = document.getElementById("actionPanel");
    if (actionPanel) {
        actionPanel.style.display = state.is_my_turn ? "flex" : "none";
    }
}

async function sendAction(isMyTurn, card = null, actionType = null) {
    if (!isMyTurn) return;
    
    // Определяем тип действия: если есть карта, смотрим, атакуем мы или защищаемся
    let type = actionType;
    if (card && !type) {
        // Простая логика: если есть неотбитая пара на столе, то это защита, иначе атака
        // Сервер сам проверит корректность
        type = "attack"; 
        // Здесь можно доработать определение (если ты защищаешься)
    }

    let url = `${API_URL}/api/durak/action?table_id=${currentTableId}&game_id=${currentGameId}&action_type=${type}`;
    if (card) {
        url += `&card_rank=${card.rank}&card_suit=${encodeURIComponent(card.suit)}`;
    }

    try {
        const res = await fetch(url, { method: "POST" });
        const data = await res.json();
        if (data.status === "ok") {
            updateGameState();
        } else {
            alert(data.detail || "Недопустимый ход");
        }
    } catch (e) {
        console.error("Ошибка отправки хода:", e);
    }
}

// Кнопки Бито и Взять
window.actionBito = () => sendAction(true, null, "bito");
window.actionTake = () => sendAction(true, null, "take");

function showGameScreen() {
    // Скрыть лобби, показать игровой экран (зависит от твоей верстки в index.html)
    document.getElementById("lobbyScreen")?.classList.add("hidden");
    document.getElementById("gameScreen")?.classList.remove("hidden");
}
