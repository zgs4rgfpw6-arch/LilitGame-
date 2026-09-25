// Переход в лобби Дурака из главного меню
function openDurakLobby() {
    // Скрываем все экраны (например, главный экран и блэкджек)
    document.querySelectorAll('.game-screen').forEach(el => el.style.display = 'none');
    
    // Показываем экран лобби дурака
    const lobbyScreen = document.getElementById('durak-lobby-screen');
    if (lobbyScreen) {
        lobbyScreen.style.display = 'block';
    }
}

// Открытие модального окна создания стола
function openCreateTableModal() {
    // Здесь позже сделаем появление красивого popup-окна с настройками (ставка, колода 36/52, тип игры)
    alert("Модальное окно создания стола в разработке!");
}

// Функция входа в существующий стол по ID
function joinTable(tableId) {
    // Здесь будет запрос на сервер или инициализация игровой сессии
    alert("Подключение к столу #" + tableId);
    
    // Пример переключения на игровой стол (скроем лобби и покажем экран игры, когда верстаем его)
    // document.getElementById('durak-lobby-screen').style.display = 'none';
    // document.getElementById('durak-game-screen').style.display = 'block';
}

// Возврат из лобби назад в главное меню
function showMainScreen() {
    const lobbyScreen = document.getElementById('durak-lobby-screen');
    if (lobbyScreen) {
        lobbyScreen.style.display = 'none';
    }
    
    // Показываем главный экран (если у тебя главный контейнер называется main-screen или аналогично)
    const mainScreen = document.getElementById('main-screen') || document.querySelector('.main-menu');
    if (mainScreen) {
        mainScreen.style.display = 'block';
    } else {
        location.reload5 ? location.reload() : window.location.reload(); // запасной вариант
    }
}
