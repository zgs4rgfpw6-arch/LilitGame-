<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LILIT CASINO</title>
    <link rel="stylesheet" href="style_bj.css">
    
    <!-- Подключение официального скрипта Telegram WebApp SDK -->
    <script src="https://telegram.org/js/telegram-web-app.js"></script>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Great+Vibes&family=Lexend:wght@500;600;700&display=swap');

        body {
            background-color: #060608;
            margin: 0;
            padding: 16px;
            padding-top: 90px;
            font-family: 'Lexend', sans-serif;
            color: #ffffff;
        }

        .screen {
            display: none;
        }
        .screen.active {
            display: block;
        }

        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }

        .brand-title {
            color: #ffffff;
            font-size: 1.2rem;
            font-weight: 700;
            letter-spacing: 4px;
            text-transform: uppercase;
            text-shadow: 
                0 0 4px #fff,
                0 0 10px #ff0055,
                0 0 20px #ff0055,
                0 0 35px #ff0055,
                0 0 60px #ff0055;
        }

        .balance-badge {
            background: #0d0d12;
            border: 1px solid rgba(0, 210, 255, 0.4);
            border-radius: 24px;
            padding: 6px 14px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 0 12px rgba(0, 210, 255, 0.15);
        }

        .balance-plus {
            color: #ff2a75;
            font-size: 1rem;
            font-weight: 700;
        }

        .balance-chip {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .balance-value {
            color: #ffffff;
            font-size: 0.95rem;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        .back-btn {
            background: #111116;
            border: 1px solid rgba(255, 42, 117, 0.3);
            border-radius: 12px;
            color: #ffffff;
            padding: 8px 16px;
            font-family: 'Lexend', sans-serif;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
        }

        .back-btn:active {
            transform: scale(0.95);
            border-color: rgba(255, 42, 117, 0.7);
        }

        .section-title {
            color: #ffffff;
            font-family: 'Cinzel', serif;
            font-size: 1.4rem;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-shadow: 
                0 0 5px #fff,
                0 0 15px #ff0055;
            margin: 0;
        }

        @keyframes signFlicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
                opacity: 1;
                filter: drop-shadow(0 0 12px rgba(255, 0, 85, 0.4));
            }
            20%, 24%, 55% {
                opacity: 0.75;
                filter: drop-shadow(0 0 2px rgba(255, 0, 85, 0.1));
            }
        }

        .logo-box-container {
            display: flex;
            justify-content: center;
            margin-top: 15px;
            margin-bottom: 30px;
            animation: signFlicker 3.5s infinite;
        }

        .logo-frame {
            position: relative;
            border: 1px solid rgba(255, 0, 85, 0.45);
            border-radius: 16px;
            padding: 24px 35px;
            text-align: center;
            background: rgba(13, 13, 18, 0.6);
            box-shadow: 
                0 0 15px rgba(255, 0, 85, 0.2),
                inset 0 0 15px rgba(255, 0, 85, 0.05);
        }

        .logo-lilit {
            font-family: 'Cinzel', serif;
            font-size: 2.4rem;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: 5px;
            text-transform: uppercase;
            text-shadow: 
                0 0 5px #fff,
                0 0 15px #ff0055,
                0 0 30px #ff0055;
            margin: 0;
            line-height: 1;
        }

        .logo-game {
            font-family: 'Great Vibes', cursive;
            font-size: 2.2rem;
            color: #ff2a75;
            position: absolute;
            bottom: 6px;
            right: 25px;
            text-shadow: 
                0 0 8px #ff0055,
                0 0 20px rgba(255, 0, 85, 0.6);
            margin: 0;
            line-height: 1;
            transform: rotate(-3deg);
        }

        .menu-container {
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-width: 400px;
            margin: 0 auto;
        }

        .menu-card {
            background: #111116;
            border: 1px solid rgba(255, 42, 117, 0.25);
            border-radius: 16px;
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 0 10px rgba(255, 42, 117, 0.08);
        }

        .menu-card:active {
            transform: scale(0.98);
            border-color: rgba(255, 42, 117, 0.6);
        }

        .menu-card-content {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .card-icon-pink { color: #ff2a75; font-size: 1.1rem; width: 22px; text-align: center; text-shadow: 0 0 8px rgba(255, 42, 117, 0.5); }
        .card-icon-blue { color: #00d2ff; font-size: 1.1rem; width: 22px; text-align: center; text-shadow: 0 0 8px rgba(0, 210, 255, 0.5); }
        .card-icon-mint { color: #50e3c2; font-size: 1.1rem; width: 22px; text-align: center; text-shadow: 0 0 8px rgba(80, 227, 194, 0.5); }

        .card-title {
            font-family: 'Lexend', sans-serif;
            font-weight: 600;
            font-size: 0.95rem;
            letter-spacing: 2px;
            color: #ffffff;
            text-transform: uppercase;
        }

        .arrow-icon {
            color: #ffffff;
            font-size: 1rem;
            opacity: 0.8;
        }

        .profile-user-card {
            background: #111116;
            border: 1px solid rgba(255, 42, 117, 0.3);
            border-radius: 20px;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 16px;
            max-width: 400px;
            margin: 20px auto;
            box-shadow: 0 0 15px rgba(255, 42, 117, 0.1);
        }

        .profile-avatar-wrapper {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid rgba(255, 42, 117, 0.5);
            flex-shrink: 0;
            background: #0d0d12;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 10px rgba(255, 42, 117, 0.3);
        }

        .profile-avatar-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: none;
        }

        .profile-avatar-placeholder {
            font-size: 1.8rem;
        }

        .profile-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
            overflow: hidden;
        }

        .profile-name {
            color: #ffffff;
            font-size: 1.1rem;
            font-weight: 700;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .profile-details-row {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .profile-username {
            color: #00d2ff;
            font-size: 0.85rem;
            font-weight: 500;
            text-shadow: 0 0 8px rgba(0, 210, 255, 0.3);
        }

        .profile-id-badge {
            background: rgba(255, 42, 117, 0.12);
            border: 1px solid rgba(255, 42, 117, 0.35);
            border-radius: 8px;
            padding: 2px 8px;
            color: #ff2a75;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 1px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .profile-id-badge:active {
            transform: scale(0.95);
            background: rgba(255, 42, 117, 0.25);
        }

        .friends-tabs {
            display: flex;
            gap: 8px;
            max-width: 400px;
            margin: 0 auto 20px auto;
        }

        .friend-tab {
            flex: 1;
            background: #111116;
            border: 1px solid rgba(255, 42, 117, 0.2);
            border-radius: 12px;
            padding: 10px;
            color: #8c8c99;
            font-family: 'Lexend', sans-serif;
            font-size: 0.8rem;
            font-weight: 600;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            text-transform: uppercase;
        }

        .friend-tab.active {
            background: rgba(255, 42, 117, 0.15);
            border-color: rgba(255, 42, 117, 0.6);
            color: #ffffff;
            box-shadow: 0 0 10px rgba(255, 42, 117, 0.15);
        }

        .friends-content-section {
            display: none;
            max-width: 400px;
            margin: 0 auto;
        }

        .friends-content-section.active {
            display: block;
        }

        .search-box {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        .search-input {
            flex: 1;
            background: #111116;
            border: 1px solid rgba(0, 210, 255, 0.3);
            border-radius: 12px;
            padding: 12px 16px;
            color: #ffffff;
            font-family: 'Lexend', sans-serif;
            font-size: 0.95rem;
            outline: none;
            transition: all 0.2s ease;
        }

        .search-input:focus {
            border-color: rgba(0, 210, 255, 0.8);
            box-shadow: 0 0 10px rgba(0, 210, 255, 0.2);
        }

        .action-btn {
            background: linear-gradient(135deg, #ff0055, #ff2a75);
            border: none;
            border-radius: 12px;
            color: #ffffff;
            padding: 0 20px;
            font-family: 'Lexend', sans-serif;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 0 12px rgba(255, 0, 85, 0.3);
        }

        .action-btn:active {
            transform: scale(0.95);
        }

        .friend-card {
            background: #111116;
            border: 1px solid rgba(255, 42, 117, 0.25);
            border-radius: 16px;
            padding: 14px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            box-shadow: 0 0 10px rgba(255, 42, 117, 0.05);
        }

        .friend-card-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .friend-avatar {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: #0d0d12;
            border: 1px solid rgba(255, 42, 117, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            overflow: hidden;
        }

        .friend-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .friend-name {
            color: #ffffff;
            font-size: 0.95rem;
            font-weight: 600;
        }

        .friend-id {
            color: #ff2a75;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .mini-btn {
            background: rgba(0, 210, 255, 0.15);
            border: 1px solid rgba(0, 210, 255, 0.4);
            border-radius: 10px;
            color: #00d2ff;
            padding: 6px 12px;
            font-family: 'Lexend', sans-serif;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .mini-btn:active {
            transform: scale(0.95);
        }

        .mini-btn-danger {
            background: rgba(255, 42, 117, 0.15);
            border-color: rgba(255, 42, 117, 0.4);
            color: #ff2a75;
        }

        .empty-text {
            color: #8c8c99;
            text-align: center;
            font-size: 0.9rem;
            margin-top: 30px;
        }

        /* Стили для Блэкджека */
        .game-screen-bj {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px;
            max-width: 400px;
            margin: 0 auto;
        }

        .bj-table-section {
            background: #111116;
            border: 1px solid rgba(0, 210, 255, 0.3);
            border-radius: 16px;
            padding: 14px;
            width: 100%;
            margin-bottom: 12px;
            box-sizing: border-box;
            box-shadow: 0 0 10px rgba(0, 210, 255, 0.1);
        }

        .bj-table-header {
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            color: #00d2ff;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .card-container {
            display: flex;
            gap: 8px;
            min-height: 125px;
            justify-content: center;
            align-items: center;
            perspective: 1000px;
            overflow-x: auto;
        }

        .bj-card {
            width: 85px;
            height: 120px;
            border-radius: 10px;
            object-fit: cover;
            box-shadow: 0 0 12px rgba(0, 255, 170, 0.35);
            will-change: transform;
            transform: translateZ(0);
            animation: cardAppear 0.3s ease-out forwards;
        }

        @keyframes cardAppear {
            from {
                opacity: 0;
                transform: translateY(-15px) scale(0.9) translateZ(0);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1) translateZ(0);
            }
        }

        .game-message {
            text-align: center;
            color: #ff2a75;
            font-weight: 600;
            font-size: 0.95rem;
            margin: 6px 0;
            min-height: 24px;
            text-shadow: 0 0 8px rgba(255, 42, 117, 0.4);
        }

        .bj-controls {
            display: flex;
            gap: 8px;
            width: 100%;
            margin-top: 10px;
        }

        .neon-btn {
            flex: 1;
            background: linear-gradient(135deg, #00ffaa, #00d2ff);
            color: #000000;
            border: none;
            padding: 12px;
            border-radius: 12px;
            font-family: 'Lexend', sans-serif;
            font-weight: 700;
            font-size: 0.9rem;
            box-shadow: 0 0 12px rgba(0, 255, 170, 0.3);
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .neon-btn:active {
            transform: scale(0.95);
        }

        .neon-btn:disabled {
            background: #1a1a24;
            color: #555566;
            box-shadow: none;
            cursor: not-allowed;
        }

        /* Блок ставок */
        .bj-bet-section {
            background: #111116;
            border: 1px solid rgba(255, 42, 117, 0.3);
            border-radius: 16px;
            padding: 12px 14px;
            width: 100%;
            margin-bottom: 10px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .bj-bet-info {
            font-size: 0.9rem;
            color: #ffffff;
            font-weight: 600;
        }
        .bj-bet-chips {
            display: flex;
            gap: 6px;
        }
        .bj-bet-btn {
            background: rgba(255, 42, 117, 0.15);
            border: 1px solid rgba(255, 42, 117, 0.4);
            border-radius: 8px;
            color: #ff2a75;
            padding: 6px 10px;
            font-family: 'Lexend', sans-serif;
            font-size: 0.8rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .bj-bet-btn:active {
            transform: scale(0.95);
        }
    </style>
</head>
<body>

    <!-- ЭКРАН 1: ГЛАВНОЕ МЕНЮ -->
    <div id="screen-main" class="screen active">
        <div class="header-top">
            <div class="brand-title">LILIT</div>
            <div class="balance-badge">
                <span class="balance-plus">+</span>
                <div class="balance-chip">
                    <span>💳</span>
                    <span class="balance-value" id="header-balance">0</span>
                </div>
            </div>
        </div>

        <div class="logo-box-container">
            <div class="logo-frame">
                <h1 class="logo-lilit">LILIT</h1>
                <p class="logo-game">game</p>
            </div>
        </div>

        <div class="menu-container">
            <div class="menu-card" onclick="switchScreen('screen-games')">
                <div class="menu-card-content">
                    <span class="card-icon-pink">♠</span>
                    <span class="card-title">ИГРЫ</span>
                </div>
                <span class="arrow-icon">→</span>
            </div>

            <div class="menu-card" onclick="switchScreen('screen-friends'); loadAllData();">
                <div class="menu-card-content">
                    <span class="card-icon-blue">♣</span>
                    <span class="card-title">ДРУЗЬЯ</span>
                </div>
                <span class="arrow-icon">→</span>
            </div>

            <div class="menu-card" onclick="switchScreen('screen-profile')">
                <div class="menu-card-content">
                    <span class="card-icon-pink">♦</span>
                    <span class="card-title">ПРОФИЛЬ</span>
                </div>
                <span class="arrow-icon">→</span>
            </div>

            <div class="menu-card" onclick="if(window.Telegram?.WebApp) window.Telegram.WebApp.close(); else alert('Выход');">
                <div class="menu-card-content">
                    <span class="card-icon-mint">♥</span>
                    <span class="card-title">ВЫХОД</span>
                </div>
                <span class="arrow-icon">→</span>
            </div>
        </div>
    </div>


    <!-- ЭКРАН 2: ИГРЫ -->
    <div id="screen-games" class="screen">
        <div class="header-top">
            <button class="back-btn" onclick="switchScreen('screen-main')">← Назад</button>
            <h2 class="section-title">Игры</h2>
            <div style="width: 70px;"></div>
        </div>

        <div class="menu-container" style="margin-top: 20px;">
            <div class="menu-card" onclick="alert('Скоро: Дурак')">
                <div class="menu-card-content">
                    <span class="card-icon-pink">♠</span>
                    <span class="card-title">ДУРАК</span>
                </div>
                <span class="arrow-icon">→</span>
            </div>

            <div class="menu-card" onclick="switchScreen('screen-blackjack')">
                <div class="menu-card-content">
                    <span class="card-icon-blue">♣</span>
                    <span class="card-title">BLACKJACK</span>
                </div>
                <span class="arrow-icon">→</span>
            </div>

            <div class="menu-card" onclick="alert('Скоро: Рулетка')">
                <div class="menu-card-content">
                    <span class="card-icon-mint">♥</span>
                    <span class="card-title">РУЛЕТКА</span>
                </div>
                <span class="arrow-icon">→</span>
            </div>
        </div>
    </div>


    <!-- ЭКРАН БЛЭКДЖЕКА -->
    <div id="screen-blackjack" class="screen">
        <div class="header-top">
            <button class="back-btn" onclick="switchScreen('screen-games')">← Назад</button>
            <h2 class="section-title" style="font-size: 1.1rem;">Blackjack</h2>
            <div class="balance-badge" style="padding: 4px 10px;">
                <span class="balance-plus" style="font-size: 0.85rem;">+</span>
                <div class="balance-chip">
                    <span style="font-size: 0.85rem;">💳</span>
                    <span class="balance-value" id="bj-balance-value" style="font-size: 0.85rem;">0</span>
                </div>
            </div>
        </div>

        <div class="game-screen-bj">
            <!-- Зона дилера -->
            <div class="bj-table-section">
                <div class="bj-table-header">
                    <span>ДИЛЕР</span>
                    <span>Очки: <span id="dealer-score">—</span></span>
                </div>
                <div id="dealer-cards" class="card-container"></div>
            </div>

            <!-- Сообщение -->
            <div id="bj-message" class="game-message">Сделайте ставку и раздайте карты</div>

            <!-- Зона игрока -->
            <div class="bj-table-section">
                <div class="bj-table-header">
                    <span>ИГРОК</span>
                    <span>Очки: <span id="player-score">0</span></span>
                </div>
                <div id="player-cards" class="card-container"></div>
            </div>

            <!-- Блок ставки -->
            <div class="bj-bet-section">
                <div class="bj-bet-info">Ставка: <span id="current-bet">100</span></div>
                <div class="bj-bet-chips">
                    <button class="bj-bet-btn" onclick="changeBet(50)">+50</button>
                    <button class="bj-bet-btn" onclick="changeBet(100)">+100</button>
                    <button class="bj-bet-btn" onclick="changeBet(500)">+500</button>
                    <button class="bj-bet-btn" onclick="resetBet()">Сброс</button>
                </div>
            </div>

            <!-- Кнопки управления игрой -->
            <div class="bj-controls">
                <button id="btn-deal" class="neon-btn" onclick="startBlackjack()">Раздать</button>
                <button id="btn-hit" class="neon-btn" onclick="playerHit()" disabled>Ещё</button>
                <button id="btn-stand" class="neon-btn" onclick="playerStand()" disabled>Хватит</button>
            </div>
        </div>
    </div>


    <!-- ЭКРАН 3: ПРОФИЛЬ -->
    <div id="screen-profile" class="screen">
        <div class="header-top">
            <button class="back-btn" onclick="switchScreen('screen-main')">← Назад</button>
            <h2 class="section-title">Профиль</h2>
            <div style="width: 70px;"></div>
        </div>

        <div class="profile-user-card">
            <div class="profile-avatar-wrapper">
                <img id="tg-avatar" src="" alt="Avatar" class="profile-avatar-img">
                <div id="tg-avatar-placeholder" class="profile-avatar-placeholder">💀</div>
            </div>
            <div class="profile-info">
                <div class="profile-name" id="tg-name">Загрузка...</div>
                <div class="profile-details-row">
                    <div class="profile-username" id="tg-username" style="display: none;">@username</div>
                    <div class="profile-id-badge" id="tg-game-id" onclick="copyGameId()" title="Нажмите, чтобы скопировать ID">ID: ----</div>
                </div>
            </div>
        </div>

        <div class="menu-container">
            <div class="menu-card" id="daily-bonus-card" onclick="claimDailyBonus()">
                <div class="menu-card-content">
                    <span class="card-icon-mint">🎁</span>
                    <div>
                        <div class="card-title">БОНУС</div>
                        <div style="font-size: 0.75rem; color: #50e3c2; margin-top: 2px;">+3 000 фишек</div>
                    </div>
                </div>
                <span style="font-size: 0.85rem; color: #50e3c2; font-weight: 600;" id="bonus-status-text">ЗАБРАТЬ</span>
            </div>
        </div>
    </div>


    <!-- ЭКРАН 4: ДРУЗЬЯ -->
    <div id="screen-friends" class="screen">
        <div class="header-top">
            <button class="back-btn" onclick="switchScreen('screen-main')">← Назад</button>
            <h2 class="section-title">Друзья</h2>
            <div style="width: 70px;"></div>
        </div>

        <div class="friends-tabs">
            <div class="friend-tab active" onclick="switchFriendTab('friends-list-tab', this)">Список (0)</div>
            <div class="friend-tab" onclick="switchFriendTab('friends-add-tab', this)">Поиск</div>
            <div class="friend-tab" onclick="switchFriendTab('friends-req-tab', this); loadFriendRequests();">Запросы (0)</div>
        </div>

        <div id="friends-list-tab" class="friends-content-section active">
            <div id="friends-container">
                <div class="empty-text">У вас пока нет друзей в списке.</div>
            </div>
        </div>

        <div id="friends-add-tab" class="friends-content-section">
            <div class="search-box">
                <input type="text" id="search-id-input" class="search-input" placeholder="Введите Game ID..." autocomplete="off">
                <button class="action-btn" onclick="searchUserById()">Найти</button>
            </div>
            <div id="search-result-container"></div>
        </div>

        <div id="friends-req-tab" class="friends-content-section">
            <div id="requests-container">
                <div class="empty-text">Загрузка запросов...</div>
            </div>
        </div>
    </div>


    <script>
        const API_URL = "https://lilitgame.onrender.com";

        function switchScreen(screenId) {
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            document.getElementById(screenId).classList.add('active');
        }

        let currentUserData = {
            tg_id: "",
            game_id: "",
            name: "Игрок",
            username: "",
            score: 0
        };

        let myFriends = [];
        let incomingRequests = [];

        // Функция обновления баланса на фронтенде и отправки на бэкенд (путь скорректирован под server.py)
        async function updateScore(newScore) {
            currentUserData.score = newScore;
            
            // Обновляем во всех элементах баланса на странице
            document.querySelectorAll('.balance-value').forEach(el => {
                el.textContent = newScore;
            });

            try {
                await fetch(`${API_URL}/api/user/update-score?game_id=${currentUserData.game_id}&new_score=${newScore}`, {
                    method: "POST"
                });
            } catch (error) {
                console.error("Ошибка обновления баланса на сервере:", error);
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            let tg = window.Telegram?.WebApp;
            if (tg) {
                tg.ready();
                tg.expand();
            }

            let tgUser = tg?.initDataUnsafe?.user;

            if (!tgUser || !tgUser.first_name) {
                tgUser = {
                    id: 6912925240,
                    first_name: "Игрок",
                    username: "",
                    photo_url: null
                };
            }

            const numericId = tgUser.id || 1000;
            
            let generatedGameId;
            if (Number(numericId) === 6912925240) {
                generatedGameId = "ID-0001";
            } else {
                generatedGameId = "ID-" + ((numericId % 9000) + 1000);
            }
            
            currentUserData.tg_id = String(numericId);
            currentUserData.game_id = generatedGameId;
            currentUserData.name = tgUser.last_name ? `${tgUser.first_name} ${tgUser.last_name}` : tgUser.first_name;
            currentUserData.username = tgUser.username || "";

            document.getElementById('tg-game-id').textContent = generatedGameId;
            document.getElementById('tg-name').textContent = currentUserData.name;
            
            const usernameEl = document.getElementById('tg-username');
            if (currentUserData.username.trim() !== "") {
                usernameEl.textContent = `@${currentUserData.username}`;
                usernameEl.style.display = 'block';
            } else {
                usernameEl.style.display = 'none';
            }

            initUserOnBackend();
        });

        async function initUserOnBackend() {
            try {
                const response = await fetch(`${API_URL}/api/auth?tg_id=${currentUserData.tg_id}&game_id=${currentUserData.game_id}&name=${encodeURIComponent(currentUserData.name)}&username=${encodeURIComponent(currentUserData.username)}`, {
                    method: "POST"
                });
                const data = await response.json();
                
                if (data.score !== undefined) {
                    currentUserData.score = data.score;
                    document.querySelectorAll('.balance-value').forEach(el => {
                        el.textContent = data.score;
                    });
                    
                    if (typeof updateBetUI === 'function' && typeof currentBet !== 'undefined') {
                        if (currentBet > data.score) {
                            currentBet = data.score > 0 ? data.score : 0;
                            updateBetUI();
                        }
                    }
                }

                const avatarRes = await fetch(`${API_URL}/api/user/avatar?tg_id=${currentUserData.tg_id}`);
                const avatarData = await avatarRes.json();
                
                if (avatarData.avatar_url) {
                    const avatarImg = document.getElementById('tg-avatar');
                    avatarImg.src = avatarData.avatar_url;
                    avatarImg.style.display = 'block';
                    document.getElementById('tg-avatar-placeholder').style.display = 'none';
                }
                
                loadAllData();
            } catch (error) {
                console.error("Ошибка связи с сервером:", error);
            }
        }

        async function claimDailyBonus() {
            try {
                const response = await fetch(`${API_URL}/api/bonus?game_id=${currentUserData.game_id}`, {
                    method: "POST"
                });
                const data = await response.json();
                
                if (response.ok) {
                    currentUserData.score = data.score;
                    document.querySelectorAll('.balance-value').forEach(el => {
                        el.textContent = data.score;
                    });
                    
                    const statusText = document.getElementById('bonus-status-text');
                    statusText.textContent = "ПОЛУЧЕНО";
                    document.getElementById('daily-bonus-card').style.opacity = "0.6";
                    document.getElementById('daily-bonus-card').style.pointerEvents = "none";
                    
                    alert("Бонус +3 000 фишек успешно зачислен!");
                } else {
                    alert(data.message || "Бонус можно получать только раз в сутки!");
                }
            } catch (error) {
                console.error("Ошибка получения бонуса:", error);
                alert("Ошибка соединения с сервером");
            }
        }

        function copyGameId() {
            if (!currentUserData.game_id) return;
            navigator.clipboard.writeText(currentUserData.game_id).then(() => {
                const badge = document.getElementById('tg-game-id');
                const originalText = badge.textContent;
                badge.textContent = "СКОПИРОВАНО!";
                setTimeout(() => {
                    badge.textContent = originalText;
                }, 1500);
            });
        }

        function switchFriendTab(tabId, tabElement) {
            document.querySelectorAll('.friends-content-section').forEach(sec => {
                sec.classList.remove('active');
            });
            document.querySelectorAll('.friend-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
            tabElement.classList.add('active');
        }

        function renderAvatarHtml(avatarValue) {
            if (!avatarValue) return '👤';
            if (avatarValue.startsWith('http')) {
                return `<img src="${avatarValue}" alt="Avatar">`;
            }
            return avatarValue;
        }

        async function searchUserById() {
            let query = document.getElementById('search-id-input').value.trim();
            const container = document.getElementById('search-result-container');

            if (!query) {
                container.innerHTML = `<div class="empty-text" style="color: #ff2a75;">Введите Game ID</div>`;
                return;
            }

            if (query.toUpperCase() === currentUserData.game_id) {
                container.innerHTML = `<div class="empty-text">Это ваш собственный ID!</div>`;
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/users/search?game_id=${encodeURIComponent(query)}`);
                if (!response.ok) {
                    container.innerHTML = `<div class="empty-text">Игрок с ID ${query} не найден</div>`;
                    return;
                }
                const foundUser = await response.json();

                container.innerHTML = `
                    <div class="friend-card" style="margin-top: 15px;">
                        <div class="friend-card-info">
                            <div class="friend-avatar">${renderAvatarHtml(foundUser.avatar)}</div>
                            <div>
                                <div class="friend-name">${foundUser.name}</div>
                                <div class="friend-id">ID: ${foundUser.id}</div>
                            </div>
                        </div>
                        <button class="mini-btn" onclick="sendFriendRequest('${foundUser.id}')" id="req-btn-${foundUser.id}">Добавить</button>
                    </div>
                `;
            } catch (error) {
                console.error("Ошибка поиска:", error);
                container.innerHTML = `<div class="empty-text" style="color: #ff2a75;">Ошибка соединения с сервером</div>`;
            }
        }

        async function sendFriendRequest(targetGameId) {
            try {
                const response = await fetch(`${API_URL}/api/friends/request?user_game_id=${currentUserData.game_id}&target_game_id=${targetGameId}`, {
                    method: "POST"
                });
                const res = await response.json();
                
                const btn = document.getElementById(`req-btn-${targetGameId}`);
                if (btn) {
                    if (res.status === "already_exists") {
                        btn.textContent = "УЖЕ ОТПРАВЛЕНО";
                    } else {
                        btn.textContent = "ОТПРАВЛЕНО";
                    }
                    btn.style.color = "#8c8c99";
                    btn.style.borderColor = "rgba(140, 140, 153, 0.4)";
                    btn.style.background = "transparent";
                    btn.disabled = true;
                }
            } catch (error) {
                console.error("Ошибка отправки заявки:", error);
                alert("Не удалось отправить заявку");
            }
        }

        async function loadFriendRequests() {
            if (!currentUserData.game_id) return;
            try {
                const response = await fetch(`${API_URL}/api/friends/requests?game_id=${currentUserData.game_id}`);
                incomingRequests = await response.json();
                updateFriendsUI();
            } catch (error) {
                console.error("Ошибка загрузки запросов:", error);
            }
        }

        async function loadFriendsList() {
            if (!currentUserData.game_id) return;
            try {
                const response = await fetch(`${API_URL}/api/friends/list?game_id=${currentUserData.game_id}`);
                myFriends = await response.json();
                updateFriendsUI();
            } catch (error) {
                console.error("Ошибка загрузки списка друзей:", error);
            }
        }

        function loadAllData() {
            loadFriendsList();
            loadFriendRequests();
        }

        function updateFriendsUI() {
            const friendsContainer = document.getElementById('friends-container');
            if (myFriends.length === 0) {
                friendsContainer.innerHTML = `<div class="empty-text">У вас пока нет друзей в списке.</div>`;
            } else {
                friendsContainer.innerHTML = myFriends.map(f => `
                    <div class="friend-card">
                        <div class="friend-card-info">
                            <div class="friend-avatar">${renderAvatarHtml(f.avatar)}</div>
                            <div>
                                <div class="friend-name">${f.name}</div>
                                <div class="friend-id">ID: ${f.id}</div>
                            </div>
                        </div>
                        <button class="mini-btn mini-btn-danger" onclick="removeFriend('${f.id}')">Удалить</button>
                    </div>
                `).join('');
            }

            const reqContainer = document.getElementById('requests-container');
            if (incomingRequests.length === 0) {
                reqContainer.innerHTML = `<div class="empty-text">Нет новых входящих запросов.</div>`;
            } else {
                reqContainer.innerHTML = incomingRequests.map(r => `
                    <div class="friend-card">
                        <div class="friend-card-info">
                            <div class="friend-avatar">${renderAvatarHtml(r.avatar)}</div>
                            <div>
                                <div class="friend-name">${r.name}</div>
                                <div class="friend-id">ID: ${r.id}</div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 6px;">
                            <button class="mini-btn" onclick="acceptRequest('${r.id}')">Принять</button>
                            <button class="mini-btn mini-btn-danger" onclick="rejectRequest('${r.id}')">Х</button>
                        </div>
                    </div>
                `).join('');
            }

            document.querySelectorAll('.friend-tab')[0].textContent = `Список (${myFriends.length})`;
            document.querySelectorAll('.friend-tab')[2].textContent = `Запросы (${incomingRequests.length})`;
        }

        async function acceptRequest(targetId) {
            try {
                const response = await fetch(`${API_URL}/api/friends/accept?user_game_id=${currentUserData.game_id}&target_game_id=${targetId}`, {
                    method: "POST"
                });
                if (response.ok) {
                    loadAllData();
                }
            } catch (error) {
                console.error("Ошибка при принятии заявки:", error);
                alert("Не удалось принять запрос");
            }
        }

        async function rejectRequest(targetId) {
            try {
                const response = await fetch(`${API_URL}/api/friends/remove?user_game_id=${currentUserData.game_id}&target_game_id=${targetId}`, {
                    method: "POST"
                });
                if (response.ok) {
                    loadAllData();
                }
            } catch (error) {
                console.error("Ошибка при отклонении заявки:", error);
            }
        }

        async function removeFriend(friendId) {
            try {
                const response = await fetch(`${API_URL}/api/friends/remove?user_game_id=${currentUserData.game_id}&target_game_id=${friendId}`, {
                    method: "POST"
                });
                if (response.ok) {
                    loadAllData();
                }
            } catch (error) {
                console.error("Ошибка при удалении друга:", error);
            }
        }
    </script>

    <!-- Подключение файла с логикой Блэкджека -->
    <script src="blackjack.js"></script>
</body>
</html>
