// Клиентская логика для игры "Дурак" под интерфейс LILIT CASINO

let durakTableId = null;
let durakPollInterval = null;
let selectedDurakCard = null;

// Загрузка списка столов в лобби
async function loadDurakTables() {
    const container = document.getElementById("durak-tables-container");
    if (!container) return;

    container.innerHTML = `<div class="empty-text">Загрузка столов...</div>`;

    try {
        const response = await fetch(`${API_URL}/api/durak/tables?game_id=${currentUserData.game_id}`);
        const tables = await response.json();

        if (!tables || tables.length === 0) {
            container.innerHTML = `<div class="empty-text">Нет активных столов. Создайте свой!</div>`;
            return;
        }

        container.innerHTML = tables.map(table => `
            <div class="table-card">
                <div class="table-info">
                    <div class="table-name">Стол #${table.table_id.slice(-4)} (${table.host_name})</div>
                    <div class="table-meta">Ставка: ${table.bet} 💳 | Игроков: ${table.players_count}/${table.max_players}</div>
                </div>
                <button class="mini-btn" onclick="joinDurakTable('${table.table_id}')">Войти</button>
            </div>
        `).join('');
    } catch (error) {
        console.error("Ошибка загрузки столов:", error);
        container.innerHTML = `<div class="empty-text" style="color: #ff2a75;">Ошибка загрузки столов</div>`;
    }
}

// Создание стола
async function createDurakTable() {
    const playersCount = document.getElementById("durak-players-count").value;
    const betAmount = document.getElementById("durak-bet-amount").value;

    if (currentUserData.score < parseInt(betAmount)) {
        alert("Недостаточно средств для ставки!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/durak/create?game_id=${currentUserData.game_id}&name=${encodeURIComponent(currentUserData.name)}&max_players=${playersCount}&bet=${betAmount}&deck_size=36`, {
            method: "POST"
        });
        const data = await response.json();

        if (response.ok && data.table_id) {
            durakTableId = data.table_id;
            switchScreen('screen-durak-game');
            startDurakPolling();
        } else {
            alert(data.detail || "Не удалось создать стол");
        }
    } catch (error) {
        console.error("Ошибка создания стола:", error);
        alert("Ошибка соединения с сервером");
    }
}

// Вход в существующий стол
async function joinDurakTable(tableId) {
    try {
        const response = await fetch(`${API_URL}/api/durak/join?table_id=${tableId}&game_id=${currentUserData.game_id}&name=${encodeURIComponent(currentUserData.name)}`, {
            method: "POST"
        });
        const data = await response.json();

        if (response.ok) {
            durakTableId = tableId;
            switchScreen('screen-durak-game');
            startDurakPolling();
        } else {
            alert(data.detail || "Не удалось войти в игру");
        }
    } catch (error) {
        console.error("Ошибка входа в стол:", error);
        alert("Ошибка соединения с сервером");
    }
}

// Выход из игры
function leaveDurakGame() {
    stopDurakPolling();
    durakTableId = null;
    switchScreen('screen-durak-lobby');
    loadDurakTables();
}

// Запуск пуллинга (обновления состояния игры)
function startDurakPolling() {
    if (durakPollInterval) clearInterval(durakPollInterval);
    updateDurakState();
    durakPollInterval = setInterval(updateDurakState, 1500);
}

function stopDurakPolling() {
    if (durakPollInterval) {
        clearInterval(durakPollInterval);
        durakPollInterval = null;
    }
}

// Получение состояния игры с сервера и рендер
async function updateDurakState() {
    if (!durakTableId) return;

    try {
        const response = await fetch(`${API_URL}/api/durak/state?table_id=${durakTableId}&game_id=${currentUserData.game_id}`);
        if (!response.ok) return;
        const state = await response.json();

        renderDurakGame(state);
    } catch (error) {
        console.error("Ошибка обновления состояния игры:", error);
    }
}

// Отрисовка игрового процесса
function renderDurakGame(state) {
    document.getElementById("durak-room-title").textContent = `Стол #${durakTableId.slice(-4)}`;
    document.getElementById("durak-deck-count").textContent = state.deck_count;
    
    // Козырная карта
    const trumpEl = document.getElementById("durak-trump-card");
    if (state.trump_card) {
        const isRed = state.trump_card.suit === '♥' || state.trump_card.suit === '♦';
        trumpEl.innerHTML = `<span style="color: ${isRed ? '#ff2a75' : '#00d2ff'}">${state.trump_card.rank}${state.trump_card.suit}</span>`;
    } else {
        trumpEl.textContent = "—";
    }

    // Сообщение / статус хода
    const msgEl = document.getElementById("durak-message");
    msgEl.textContent = state.status_message || (state.is_my_turn ? "Ваш ход!" : "Ход противника...");

    // Противники
    const enemyNameEl = document.getElementById("durak-enemy-name");
    const enemyCountEl = document.getElementById("durak-enemy-count");
    const enemyCardsContainer = document.getElementById("durak-enemy-cards");

    if (state.opponents && state.opponents.length > 0) {
        const opp = state.opponents[0];
        enemyNameEl.textContent = opp.name.toUpperCase();
        enemyCountEl.textContent = opp.cards_count;
        
        // Рубашки карт противника
        enemyCardsContainer.innerHTML = Array(opp.cards_count).fill('<div class="bj-card" style="background: #1a1a24; border: 1px solid rgba(255,42,117,0.3); width: 50px; height: 75px;"></div>').join('');
    }

    // Карты на столе (пары атака / защита)
    const tableCardsContainer = document.getElementById("durak-table-cards");
    tableCardsContainer.innerHTML = "";
    if (state.table_cards && state.table_cards.length > 0) {
        state.table_cards.forEach(pair => {
            const pairDiv = document.createElement("div");
            pairDiv.style.display = "flex";
            pairDiv.style.gap = "4px";
            pairDiv.style.alignItems = "center";
            pairDiv.style.background = "rgba(0,0,0,0.2)";
            pairDiv.style.padding = "4px";
            pairDiv.style.borderRadius = "8px";

            const attRed = pair.attack.suit === '♥' || pair.attack.suit === '♦';
            pairDiv.innerHTML += `<div class="bj-card" style="width: 55px; height: 80px; display: flex; align-items: center; justify-content: center; background: #fff; color: ${attRed ? '#ff2a75' : '#000'}; font-weight: 700; font-size: 0.9rem; border-radius: 6px;">${pair.attack.rank}${pair.attack.suit}</div>`;

            if (pair.defense) {
                const defRed = pair.defense.suit === '♥' || pair.defense.suit === '♦';
                pairDiv.innerHTML += `<div class="bj-card" style="width: 55px; height: 80px; display: flex; align-items: center; justify-content: center; background: #fff; color: ${defRed ? '#ff2a75' : '#000'}; font-weight: 700; font-size: 0.9rem; border-radius: 6px;">${pair.defense.rank}${pair.defense.suit}</div>`;
            } else {
                pairDiv.innerHTML += `<div class="bj-card" style="width: 55px; height: 80px; display: flex; align-items: center; justify-content: center; background: #1a1a24; color: #8c8c99; font-size: 0.8rem; border-radius: 6px; border: 1px dashed rgba(255,255,255,0.2);">?</div>`;
            }
            tableCardsContainer.appendChild(pairDiv);
        });
    } else {
        tableCardsContainer.innerHTML = `<div style="color: #8c8c99; font-size: 0.85rem;">Стол пуст</div>`;
    }

    // Мои карты в руке
    const myCardsContainer = document.getElementById("durak-player-cards");
    myCardsContainer.innerHTML = "";
    if (state.my_cards) {
        state.my_cards.forEach((card, index) => {
            const isRed = card.suit === '♥' || card.suit === '♦';
            const cardEl = document.createElement("div");
            cardEl.className = "bj-card";
            cardEl.style.cssText = `
                width: 65px; height: 95px; background: #fff; color: ${isRed ? '#ff2a75' : '#000'};
                display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1rem;
                cursor: pointer; border-radius: 8px; transition: transform 0.2s;
                ${selectedDurakCard === index ? 'transform: translateY(-10px); box-shadow: 0 0 15px #ff2a75;' : ''}
            `;
            cardEl.textContent = `${card.rank}${card.suit}`;
            cardEl.onclick = () => selectCard(index);
            myCardsContainer.appendChild(cardEl);
        });
    }

    // Активность кнопок управления
    const actionBtn = document.getElementById("btn-durak-action");
    const takeBtn = document.getElementById("btn-durak-take");

    actionBtn.disabled = !state.is_my_turn;
    takeBtn.disabled = !state.is_my_turn;
    
    // Меняем текст кнопки в зависимости от роли (атака/бито или защита)
    actionBtn.textContent = state.is_attacker ? "Бито" : "Побить";
}

// Выбор карты в руке
function selectCard(index) {
    selectedDurakCard = selectedDurakCard === index ? null : index;
    updateDurakState(); // Перерисовка для подсветки выбранной карты
}

// Кнопка главного действия (Атака / Бито / Защита)
async function durakMainAction() {
    if (selectedDurakCard === null) {
        // Если карта не выбрана, возможно это нажатие «Бито»
        sendDurakAction("bito");
        return;
    }

    // Отправляем ход с выбранной картой
    try {
        const response = await fetch(`${API_URL}/api/durak/action?table_id=${durakTableId}&game_id=${currentUserData.game_id}&card_index=${selectedDurakCard}`, {
            method: "POST"
        });
        const data = await response.json();
        if (response.ok) {
            selectedDurakCard = null;
            updateDurakState();
        } else {
            alert(data.detail || "Недопустимый ход");
        }
    } catch (error) {
        console.error("Ошибка хода:", error);
    }
}

// Кнопка «Взять»
async function durakTakeCards() {
    sendDurakAction("take");
}

async function sendDurakAction(actionType) {
    try {
        const response = await fetch(`${API_URL}/api/durak/action?table_id=${durakTableId}&game_id=${currentUserData.game_id}&action_type=${actionType}`, {
            method: "POST"
        });
        const data = await response.json();
        if (response.ok) {
            selectedDurakCard = null;
            updateDurakState();
        } else {
            alert(data.detail || "Действие недоступно");
        }
    } catch (error) {
        console.error("Ошибка действия:", error);
    }
}
