// Клиентская логика для игры "Дурак" под интерфейс LILIT CASINO

let durakTableId = null;
let durakPollInterval = null;
let selectedDurakCard = null;
let lastRenderedState = "";
let draggedCardIndex = null;

// Полный маппинг всех карт и рубашки с хостинга Postimages
const cardImages = {
    'spades_2': 'https://i.postimg.cc/4YC4LJj8/2ka-pik.jpg',
    'spades_3': 'https://i.postimg.cc/dhMQHqgB/3ka-pik.jpg',
    'spades_4': 'https://i.postimg.cc/sMFf6VbK/4ka-pik.jpg',
    'spades_5': 'https://i.postimg.cc/0zg5W8hc/5ka-pik.jpg',
    'spades_6': 'https://i.postimg.cc/18pmbkQ4/6ka-pik.png',
    'spades_7': 'https://i.postimg.cc/w1hqnCp1/7ka-pik.png',
    'spades_8': 'https://i.postimg.cc/9DGms6h4/8ka-pik.png',
    'spades_9': 'https://i.postimg.cc/qN8JWPTh/9ka-pik.png',
    'spades_10': 'https://i.postimg.cc/Mny6gCSj/10ka-pik.png',
    'spades_j': 'https://i.postimg.cc/yJs1KL1Y/Jka-pik.png',
    'spades_q': 'https://i.postimg.cc/Z94bmwbn/Qka-pik.png',
    'spades_k': 'https://i.postimg.cc/Y4Mr7drC/Kka-pik.png',
    'spades_a': 'https://i.postimg.cc/1gsmSvmm/Aka-pik.png',

    'clubs_2': 'https://i.postimg.cc/5H4VTjgz/2ka-tref.png',
    'clubs_3': 'https://i.postimg.cc/t1qjw7k3/3ka-tref.png',
    'clubs_4': 'https://i.postimg.cc/gwzWQrsv/4ka-tref.png',
    'clubs_5': 'https://i.postimg.cc/HJYgRjz4/5ka-tref.png',
    'clubs_6': 'https://i.postimg.cc/3y8TVW1F/6ka-tref.png',
    'clubs_7': 'https://i.postimg.cc/HJYgRjzt/7ka-tref.png',
    'clubs_8': 'https://i.postimg.cc/WDNvCt8n/8ka-tref.png',
    'clubs_9': 'https://i.postimg.cc/qtJTSgwm/9ka-tref.png',
    'clubs_10': 'https://i.postimg.cc/XZjbmXL1/10ka-tref.png',
    'clubs_j': 'https://i.postimg.cc/67WXgTcD/Jka-tref.png',
    'clubs_q': 'https://i.postimg.cc/94LhhVgk/Qka-tref.png',
    'clubs_k': 'https://i.postimg.cc/Y4dHHkDy/Kka-tref.png',
    'clubs_a': 'https://i.postimg.cc/Y4rHZjRZ/Aka-tref.png',

    'diamonds_2': 'https://i.postimg.cc/fVhZ7808/2ka-bub.jpg',
    'diamonds_3': 'https://i.postimg.cc/WdPjm5J9/3ka-bub.jpg',
    'diamonds_4': 'https://i.postimg.cc/3kH7jtDS/4ka-bub.jpg',
    'diamonds_5': 'https://i.postimg.cc/9DjVPLqN/5ka-bub.jpg',
    'diamonds_6': 'https://i.postimg.cc/zy15wxRc/6ka-bub.jpg',
    'diamonds_7': 'https://i.postimg.cc/mPGR3mFK/7ka-bub.jpg',
    'diamonds_8': 'https://i.postimg.cc/68NwVMGg/8ka-bub.jpg',
    'diamonds_9': 'https://i.postimg.cc/21fmd0Bs/9ka-bub.jpg',
    'diamonds_10': 'https://i.postimg.cc/rDLcGfr6/10ka-bub.jpg',
    'diamonds_j': 'https://i.postimg.cc/YvwkNdWk/Jka-bub.jpg',
    'diamonds_q': 'https://i.postimg.cc/NKwY8dHB/Qka-bub.jpg',
    'diamonds_k': 'https://i.postimg.cc/k2d9NTbC/Kka-bub.jpg',
    'diamonds_a': 'https://i.postimg.cc/nXtZK3DJ/Aka-bub.jpg',

    'hearts_2': 'https://i.postimg.cc/grQGjzcW/2-hearts.jpg',
    'hearts_3': 'https://i.postimg.cc/JtvR0r78/3-hearts.jpg',
    'hearts_4': 'https://i.postimg.cc/8s9TcpkD/4-hearts.jpg',
    'hearts_5': 'https://i.postimg.cc/qgSpqJBp/5-hearts.jpg',
    'hearts_6': 'https://i.postimg.cc/kDz7GJMn/6-hearts.png',
    'hearts_7': 'https://i.postimg.cc/WtCszNpN/7-hearts.png',
    'hearts_8': 'https://i.postimg.cc/ThFT1d2Y/8-hearts.png',
    'hearts_9': 'https://i.postimg.cc/kDz7GJMg/9-hearts.png',
    'hearts_10': 'https://i.postimg.cc/Lhwm594s/10-hearts.png',
    'hearts_j': 'https://i.postimg.cc/HjRTnYWn/J-hearts.png',
    'hearts_q': 'https://i.postimg.cc/t7w9JqRY/Q-hearts.png',
    'hearts_k': 'https://i.postimg.cc/mhJTkLZh/K-hearts.png',
    'hearts_a': 'https://i.postimg.cc/Lhwm594X/A-hearts.png',

    'card_back': 'https://i.postimg.cc/YjGwJ56X/Rubaxa.png'
};

// Вспомогательная функция для получения ключа картинки карты
function getCardImageKey(card) {
    const suitMap = { '♠': 'spades', '♣': 'clubs', '♦': 'diamonds', '♥': 'hearts' };
    const rankMap = { 'J': 'j', 'Q': 'q', 'K': 'k', 'A': 'a', '10': '10', '9': '9', '8': '8', '7': '7', '6': '6', '5': '5', '4': '4', '3': '3', '2': '2' };
    
    const suit = suitMap[card.suit];
    const rank = rankMap[String(card.rank).toUpperCase()];
    return `${suit}_${rank}`;
}

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
            selectedDurakCard = null;
            lastRenderedState = "";
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
            selectedDurakCard = null;
            lastRenderedState = "";
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
    selectedDurakCard = null;
    lastRenderedState = "";
    switchScreen('screen-durak-lobby');
    loadDurakTables();
}

// Запуск пуллинга
function startDurakPolling() {
    if (durakPollInterval) clearInterval(durakPollInterval);
    updateDurakState();
    durakPollInterval = setInterval(updateDurakState, 2500);
}

function stopDurakPolling() {
    if (durakPollInterval) {
        clearInterval(durakPollInterval);
        durakPollInterval = null;
    }
}

// Получение состояния игры с сервера
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
    const stateString = JSON.stringify({
        deck: state.deck_count,
        trump: state.trump_card,
        msg: state.status_message,
        turn: state.is_my_turn,
        attacker: state.is_attacker,
        opp: state.opponents,
        table: state.table_cards,
        my: state.my_cards
    });

    if (stateString === lastRenderedState) return;
    lastRenderedState = stateString;

    // Счётчик колоды
    const deckCountEl = document.getElementById("durak-deck-count");
    if (deckCountEl) deckCountEl.textContent = state.deck_count;
    
    // Козырная карта
    const trumpEl = document.getElementById("durak-trump-card");
    if (trumpEl && state.trump_card) {
        const imgKey = getCardImageKey(state.trump_card);
        const imgUrl = cardImages[imgKey] || cardImages['card_back'];
        trumpEl.innerHTML = `<img src="${imgUrl}" alt="Trump" style="width: 45px; height: 65px; object-fit: cover; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.5);">`;
    }

    // Сообщение / статус хода
    const msgEl = document.getElementById("durak-message");
    if (msgEl) {
        const isMyTurn = state.is_my_turn;
        msgEl.textContent = state.status_message || (isMyTurn ? "Ваш ход (Атака)" : "Ход противника...");
        msgEl.style.cssText = `
            font-weight: 700; font-size: 0.9rem; text-align: center; padding: 6px 14px;
            background: ${isMyTurn ? 'rgba(255, 42, 117, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
            border: 1px solid ${isMyTurn ? 'rgba(255, 42, 117, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
            border-radius: 20px; color: ${isMyTurn ? '#ff2a75' : '#a0a0b0'};
            box-shadow: ${isMyTurn ? '0 0 12px rgba(255, 42, 117, 0.3)' : 'none'};
        `;
    }

    // Противники
    const enemyNameEl = document.getElementById("durak-enemy-name");
    const enemyCountEl = document.getElementById("durak-enemy-count");
    const enemyCardsContainer = document.getElementById("durak-enemy-cards");
    const enemyAvatarEl = document.getElementById("durak-enemy-avatar");

    if (state.opponents && state.opponents.length > 0) {
        const opp = state.opponents[0];
        if (enemyNameEl) enemyNameEl.textContent = opp.name.toUpperCase();
        if (enemyCountEl) enemyCountEl.textContent = opp.cards_count;
        
        if (enemyAvatarEl && opp.avatar) {
            enemyAvatarEl.innerHTML = `<img src="${opp.avatar}" alt="" style="width: 100%; height: 100%; object-fit: cover;">`;
        }
        
        if (enemyCardsContainer) {
            enemyCardsContainer.innerHTML = Array(opp.cards_count).fill(`
                <img src="${cardImages['card_back']}" style="width: 38px; height: 55px; object-fit: cover; border-radius: 4px; margin-left: -18px; box-shadow: 0 2px 6px rgba(0,0,0,0.5);">
            `).join('');
            enemyCardsContainer.style.cssText = "display: flex; justify-content: center; padding-left: 18px;";
        }
    }

    // Карты на столе
    const tableCardsContainer = document.getElementById("durak-table-cards");
    if (tableCardsContainer) {
        tableCardsContainer.innerHTML = "";
        tableCardsContainer.style.cssText = `
            display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; align-items: center;
            min-height: 115px; padding: 12px; background: rgba(15, 15, 22, 0.4);
            border: 1px dashed rgba(255, 255, 255, 0.12); border-radius: 16px; width: 100%; max-width: 340px; margin: 0 auto;
        `;

        if (state.table_cards && state.table_cards.length > 0) {
            state.table_cards.forEach(pair => {
                const pairDiv = document.createElement("div");
                pairDiv.style.cssText = "display: flex; gap: 6px; align-items: center; background: rgba(0,0,0,0.3); padding: 6px; border-radius: 12px;";

                const attKey = getCardImageKey(pair.attack);
                const attUrl = cardImages[attKey] || cardImages['card_back'];
                pairDiv.innerHTML += `<img src="${attUrl}" style="width: 62px; height: 90px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">`;

                if (pair.defense) {
                    const defKey = getCardImageKey(pair.defense);
                    const defUrl = cardImages[defKey] || cardImages['card_back'];
                    pairDiv.innerHTML += `<img src="${defUrl}" style="width: 62px; height: 90px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">`;
                } else {
                    pairDiv.innerHTML += `
                        <div style="width: 62px; height: 90px; background: rgba(25, 25, 35, 0.6); border: 2px dashed rgba(255, 42, 117, 0.3); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #ff2a75; font-size: 1.2rem;">·</div>
                    `;
                }
                tableCardsContainer.appendChild(pairDiv);
            });
        } else {
            tableCardsContainer.innerHTML = `<div style="color: #6b6b80; font-size: 0.85rem; font-style: italic;">Стол пуст</div>`;
        }
    }

    // Мои карты в руке (Веер)
    const myCardsContainer = document.getElementById("durak-player-cards");
    const myCardsCountEl = document.getElementById("durak-my-cards-count");
    
    if (myCardsCountEl && state.my_cards) {
        myCardsCountEl.textContent = `Карт: ${state.my_cards.length}`;
    }

    if (myCardsContainer && state.my_cards) {
        myCardsContainer.innerHTML = "";
        myCardsContainer.style.cssText = "position: relative; height: 110px; display: flex; justify-content: center; align-items: flex-end; width: 100%; padding: 0 20px;";
        
        const totalCards = state.my_cards.length;
        state.my_cards.forEach((card, index) => {
            const imgKey = getCardImageKey(card);
            const imgUrl = cardImages[imgKey] || cardImages['card_back'];
            const isSelected = selectedDurakCard === index;

            // Расчет веера (дуги)
            const angle = totalCards > 1 ? (index - (totalCards - 1) / 2) * 7 : 0;
            const translateY = Math.abs(index - (totalCards - 1) / 2) * 4;

            const cardEl = document.createElement("div");
            cardEl.className = "bj-card";
            cardEl.style.cssText = `
                position: absolute;
                width: 68px; 
                height: 98px; 
                border-radius: 8px;
                background-image: url('${imgUrl}');
                background-size: cover;
                background-position: center;
                box-shadow: 0 4px 15px rgba(0,0,0,0.6);
                cursor: pointer;
                transform-origin: bottom center;
                transform: translateX(${(index - (totalCards - 1) / 2) * 32}px) translateY(${isSelected ? -20 : translateY}px) rotate(${angle}deg);
                transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s;
                z-index: ${isSelected ? 20 : index + 1};
                border: ${isSelected ? '2px solid #ff2a75' : '1px solid rgba(255,255,255,0.4)'};
            `;

            // Клик для выбора карты
            cardEl.onclick = () => selectCard(index);

            // Добавляем поддержку перетаскивания (Drag-and-Drop) на стол
            setupCardDrag(cardEl, index);

            myCardsContainer.appendChild(cardEl);
        });
    }

    // Кнопки управления
    const actionBtn = document.getElementById("btn-durak-action");
    const takeBtn = document.getElementById("btn-durak-take");

    if (actionBtn && takeBtn) {
        actionBtn.disabled = !state.is_my_turn;
        takeBtn.disabled = !state.is_my_turn;
        actionBtn.textContent = state.is_attacker ? "Бито" : "Побить";
    }
}

// Выбор карты в руке
function selectCard(index) {
    selectedDurakCard = selectedDurakCard === index ? null : index;
    // Перерисовываем руку локально, чтобы обновить веер и поднятую карту
    if (lastRenderedState) {
        const parsed = JSON.parse(lastRenderedState);
        lastRenderedState = ""; // Сбрасываем кэш рендера для принудительного обновления веера
        renderDurakGame({ ...parsed, my_cards: parsed.my, table_cards: parsed.table });
    }
}

// Настройка перетаскивания карты (Drag and Drop для мыши и тач-устройств)
function setupCardDrag(cardEl, index) {
    let startX = 0, startY = 0;
    let initialX = 0, initialY = 0;
    let isDragging = false;

    const onStart = (e) => {
        const touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        isDragging = false;
        selectedDurakCard = index;
    };

    const onMove = (e) => {
        const touch = e.touches ? e.touches[0] : e;
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
            isDragging = true;
            cardEl.style.transform = `translate(${dx}px, ${dy}px) scale(1.1) rotate(0deg)`;
            cardEl.style.zIndex = '100';
        }
    };

    const onEnd = (e) => {
        if (!isDragging) return;
        
        const touch = e.changedTouches ? e.changedTouches[0] : e;
        const tableArea = document.getElementById("durak-table-cards");
        
        if (tableArea) {
            const rect = tableArea.getBoundingClientRect();
            // Проверяем, бросил ли игрок карту в зону стола
            if (
                touch.clientX >= rect.left && 
                touch.clientX <= rect.right && 
                touch.clientY >= rect.top && 
                touch.clientY <= rect.bottom
            ) {
                // Выполняем ход этой картой
                durakPlayCard(index);
                return;
            }
        }

        // Если бросили мимо стола — возвращаем на место
        lastRenderedState = "";
        updateDurakState();
    };

    cardEl.addEventListener("touchstart", onStart, { passive: true });
    cardEl.addEventListener("touchmove", onMove, { passive: true });
    cardEl.addEventListener("touchend", onEnd);

    cardEl.addEventListener("mousedown", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
}

// Отправка карты на сервер при клике или перетаскивании
async function durakPlayCard(cardIndex) {
    try {
        const response = await fetch(`${API_URL}/api/durak/action?table_id=${durakTableId}&game_id=${currentUserData.game_id}&card_index=${cardIndex}`, {
            method: "POST"
        });
        const data = await response.json();
        if (response.ok) {
            selectedDurakCard = null;
            lastRenderedState = "";
            updateDurakState();
        } else {
            alert(data.detail || "Недопустимый ход");
        }
    } catch (error) {
        console.error("Ошибка хода:", error);
    }
}

// Кнопка главного действия (Атака / Бито / Защита)
async function durakMainAction() {
    if (selectedDurakCard === null) {
        sendDurakAction("bito");
        return;
    }
    durakPlayCard(selectedDurakCard);
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
            lastRenderedState = "";
            updateDurakState();
        } else {
            alert(data.detail || "Действие недоступно");
        }
    } catch (error) {
        console.error("Ошибка действия:", error);
    }
}
