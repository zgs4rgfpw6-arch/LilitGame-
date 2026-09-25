const DurakGame = require('./durak.js');

class GameManager {
    constructor() {
        this.activeGames = new Map(); // Ключ: roomId (или chatId), Значение: экземпляр DurakGame
    }

    createGame(roomId, players) {
        const game = new DurakGame();
        game.initGame(players);
        this.activeGames.set(roomId, { game, players });
        return { game, players };
    }

    getGame(roomId) {
        return this.activeGames.get(roomId);
    }

    removeGame(roomId) {
        this.activeGames.delete(roomId);
    }
}

module.exports = new GameManager();
