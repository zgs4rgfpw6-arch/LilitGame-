// Клиентский менеджер игры и интерфейса для Telegram Mini App

class GameManager {
    constructor() {
        this.currentBalance = 0;
        this.initTelegram();
    }

    // Инициализация Telegram WebApp
    initTelegram() {
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.expand();
            console.log("Telegram WebApp успешно инициализирован.");
        }
    }

    // Загрузка баланса и данных пользователя
    async loadAllData() {
        try {
            let userId = 'test_user';
            
            // Пытаемся взять реальный ID из Telegram
            if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe?.user) {
                userId = window.Telegram.WebApp.initDataUnsafe.user.id;
            }

            // Запрос к вашему серверу (server.py) за балансом
            const response = await fetch(`/api/get_user?user_id=${userId}`);
            if (response.ok) {
                const data = await response.json();
                this.currentBalance = data.balance || 0;
                this.updateBalanceUI();
            } else {
                // Запасной вариант для локального тестирования в браузере
                this.currentBalance = 1000;
                this.updateBalanceUI();
            }
        } catch (e) {
            console.error("Ошибка при загрузке данных:", e);
            // Если сервер недоступен, ставим дефолтное значение, чтобы интерфейс не зависал
            this.currentBalance = 1000;
            this.updateBalanceUI();
        }
    }

    // Обновление баланса во всех элементах интерфейса
    updateBalanceUI() {
        const balanceElements = document.querySelectorAll('#header-balance, #durak-lobby-balance, #durak-header-score, #bj-balance-value');
        balanceElements.forEach(el => {
            if (el) el.textContent = this.currentBalance;
        });
    }

    // Универсальное переключение экранов
    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.add('active');
            window.scrollTo(0, 0);
        } else {
            console.error("Экран не найден: " + screenId);
        }
    }

    // Выход из приложения
    closeApp() {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.close();
        } else {
            alert('Выход из приложения');
        }
    }
}

// Создаем глобальный экземпляр менеджера
const gameManager = new GameManager();

// Автоматический запуск при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    gameManager.loadAllData();
});
