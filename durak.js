// --- LILIT CASINO: DURAK CLIENT LOGIC (DRAG-AND-DROP) ---

if (typeof window.durakTableId === 'undefined') {
    window.durakTableId = null;
    window.durakPollInterval = null;
    window.selectedDurakCard = null;
    window.lastRenderedState = "";
}

// Словарь картинок карт (ваши ссылки с Postimage)
const durakCardImages = {
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

function getDurakCardImageKey(card) {
    const suitMap = { '♠': 'spades', '♣': 'clubs', '♦': 'diamonds', '♥': 'hearts' };
    const rankMap = { 'J': 'j', 'Q': 'q', 'K': 'k', 'A': 'a', '10': '10', '9': '9', '8': '8', '7': '7', '6': '6', '5': '5', '4': '4', '3': '3', '2': '2' };
    
    const suit = suitMap[card.suit];
    const rank = rankMap[String(card.rank).toUpperCase()];
    return `${suit}_${rank}`;
}

// Запуск опроса сервера (поллинг)
function startDurakPolling() {
    if (durakPollInterval) clearInterval(durakPollInterval);
    updateDurakState();
    durakPollInterval = setInterval(updateDurakState, 2000);
}

function stopDurakPolling() {
    if (durakPollInterval) {
        clearInterval(durakPollInterval);
        durakPollInterval = null;
    }
}

// Получение актуального состояния стола
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

    // Колода
    const deckCountEl = document.getElementById("durak-deck-count");
    if (deckCountEl) deckCountEl.textContent = state.deck_count;
    
    // Козырь
    const trumpEl = document.getElementById("durak-trump-card");
    if (trumpEl && state.trump_card) {
        const imgKey = getDurakCardImageKey(state.trump_card);
        const imgUrl = durakCardImages[imgKey] || durakCardImages['card_back'];
        trumpEl.innerHTML = `<img src="${imgUrl}" alt="Trump" style="width: 45px; height: 65px; object-fit: cover; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.5);">`;
    }

    // Сообщение / Статус
    const msgEl = document.getElementById("durak-message");
    if (msgEl) {
        const isMyTurn = state.is_my_turn;
        msgEl.textContent = state.status_message || (isMyTurn ? (state.is_attacker ? "Ваш ход (Атака)" : "Ваш ход (Защита)") : "Ход противника...");
        msgEl.style.cssText = `
            font-weight: 700; font-size: 0.9rem; text-align: center; padding: 6px 14px;
            background: ${isMyTurn ? 'rgba(255, 42, 117, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
            border: 1px solid ${isMyTurn ? 'rgba(255, 42, 117, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
            border-radius: 20px; color: ${isMyTurn ? '#ff2a75' : '#a0a0b0'};
        `;
    }

    // Противник
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
                <img src="${durakCardImages['card_back']}" style="width: 38px; height: 55px; object-fit: cover; border-radius: 4px; margin-left: -18px; box-shadow: 0 2px 6px rgba(0,0,0,0.5);">
            `).join('');
        }
    }

    // Карты на столе (пары атака-защита)
    const tableCardsContainer = document.getElementById("durak-table-cards");
    if (tableCardsContainer) {
        tableCardsContainer.innerHTML = "";
        tableCardsContainer.style.cssText = `
            display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; align-items: center;
            min-height: 115px; padding: 12px; background: rgba(15, 15, 22, 0.4);
            border: 1px dashed rgba(255, 255, 255, 0.12); border-radius: 16px; width: 100%; max-width: 340px; margin: 0 auto;
        `;

        if (state.table_cards && state.table_cards.length > 0) {
            state.table_cards.forEach((pair, pairIndex) => {
                const pairDiv = document.createElement("div");
                pairDiv.className = "durak-table-pair";
                pairDiv.dataset.pairIndex = pairIndex;
                pairDiv.style.cssText = "display: flex; gap: 6px; align-items: center; background: rgba(0,0,0,0.3); padding: 6px; border-radius: 12px;";

                // Карта атаки
                const attKey = getDurakCardImageKey(pair.attack);
                const attUrl = durakCardImages[attKey] || durakCardImages['card_back'];
                pairDiv.innerHTML += `<img src="${attUrl}" style="width: 62px; height: 90px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">`;

                // Карта защиты (или пустой слот для отбивания перетаскиванием)
                if (pair.defense) {
                    const defKey = getDurakCardImageKey(pair.defense);
                    const defUrl = durakCardImages[defKey] || durakCardImages['card_back'];
                    pairDiv.innerHTML += `<img src="${defUrl}" style="width: 62px; height: 90px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">`;
                } else {
                    pairDiv.innerHTML += `
                        <div class="durak-defend-slot" data-pair-index="${pairIndex}" style="width: 62px; height: 90px; background: rgba(25, 25, 35, 0.6); border: 2px dashed rgba(255, 42, 117, 0.4); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #ff2a75; font-size: 1.2rem;">·</div>
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
            const imgKey = getDurakCardImageKey(card);
            const imgUrl = durakCardImages[imgKey] || durakCardImages['card_back'];
            const angle = totalCards > 1 ? (index - (totalCards - 1) / 2) * 7 : 0;
            const translateY = Math.abs(index - (totalCards - 1) / 2) * 4;

            const cardEl = document.createElement("div");
            cardEl.className = "durak-hand-card";
            cardEl.dataset.cardIndex = index;
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
                transform: translateX(${(index - (totalCards - 1) / 2) * 32}px) translateY(${translateY}px) rotate(${angle}deg);
                z-index: ${index + 1};
                border: 1px solid rgba(255,255,255,0.4);
                touch-action: none;
            `;

            // Подключаем полноценный Drag-and-Drop (как в Дурак Online)
            setupDurakDragAndDrop(cardEl, index);
            myCardsContainer.appendChild(cardEl);
        });
    }

    // Управление кнопками под роль (Атака / Защита)
    const actionBtn = document.getElementById("btn-durak-action");
    const takeBtn = document.getElementById("btn-durak-take");

    if (actionBtn && takeBtn) {
        actionBtn.disabled = !state.is_my_turn;
        takeBtn.disabled = !state.is_my_turn;
        
        if (state.is_attacker) {
            actionBtn.style.display = "inline-block";
            actionBtn.textContent = state.table_cards && state.table_cards.length > 0 ? "Бито" : "Пас";
            takeBtn.style.display = "none";
        } else {
            actionBtn.style.display = "none";
            takeBtn.style.display = "inline-block";
            takeBtn.textContent = "Беру";
        }
    }
}

// --- НАСТОЯЩИЙ ДРАГ-Н-ДРОП (ДУРАК ONLINE СТИЛЬ) ---
function setupDurakDragAndDrop(cardEl, cardIndex) {
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;
    let isDragging = false;

    const onStart = (e) => {
        const touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        isDragging = false;

        // Поднимаем карточку поверх остальных при начале касания
        cardEl.style.zIndex = '1000';
        cardEl.style.transition = 'none';
    };

    const onMove = (e) => {
        const touch = e.touches ? e.touches[0] : e;
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
            isDragging = true;
            // Перетаскиваем за пальцем с увеличением
            cardEl.style.transform = `translate(${dx}px, ${dy}px) scale(1.15) rotate(0deg)`;
        }
    };

    const onEnd = (e) => {
        if (!isDragging) {
            // Если просто тапнули без перетаскивания — можно сделать выбор/подъем карты
            cardEl.style.zIndex = cardIndex + 1;
            lastRenderedState = "";
            updateDurakState();
            return;
        }

        const touch = e.changedTouches ? e.changedTouches[0] : e;
        const tableArea = document.getElementById("durak-table-cards");

        if (tableArea) {
            const tableRect = tableArea.getBoundingClientRect();
            
            // Проверяем, попал ли палец в зону игрового стола
            if (
                touch.clientX >= tableRect.left && 
                touch.clientX <= tableRect.right && 
                touch.clientY >= tableRect.top && 
                touch.clientY <= tableRect.bottom
            ) {
                // Ищем, на какую конкретно карту защиты/пару перетащили (если защищаемся)
                const defendSlots = document.querySelectorAll(".durak-defend-slot");
                let targetPairIndex = null;

                defendSlots.forEach(slot => {
                    const rect = slot.getBoundingClientRect();
                    if (
                        touch.clientX >= rect.left - 10 && touch.clientX <= rect.right + 10 &&
                        touch.clientY >= rect.top - 10 && touch.clientY <= rect.bottom + 10
                    ) {
                        targetPairIndex = slot.dataset.pairIndex;
                    }
                });

                if (targetPairIndex !== null) {
                    // Отбиваем конкретную карту на столе
                    durakPlayCard(cardIndex, targetPairIndex);
                } else {
                    // Делаем ход в пустую зону стола (атака / подкидывание)
                    durakPlayCard(cardIndex, null);
                }
                return;
            }
        }

        // Если бросили мимо стола — карта плавно возвращается в руку
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

// Отправка хода на сервер
async function durakPlayCard(cardIndex, targetPairIndex = null) {
    try {
        let url = `${API_URL}/api/durak/action?table_id=${durakTableId}&game_id=${currentUserData.game_id}&card_index=${cardIndex}`;
        if (targetPairIndex !== null) {
            url += `&target_pair=${targetPairIndex}`;
        }

        const response = await fetch(url, { method: "POST" });
        const data = await response.json();
        
        if (response.ok) {
            selectedDurakCard = null;
            lastRenderedState = "";
            updateDurakState();
        } else {
            alert(data.detail || "Недопустимый ход по правилам!");
            lastRenderedState = "";
            updateDurakState();
        }
    } catch (error) {
        console.error("Ошибка хода:", error);
    }
}

// Кнопка "Бито" / "Пас"
async function durakMainAction() {
    sendDurakAction("bito");
}

// Кнопка "Беру"
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
