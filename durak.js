/**
 * Модуль игровой логики классического карточного «Дурака» (подкидного)
 */
class DurakGame {
    constructor() {
        this.suits = ['♠', '♣', '♦', '♥'];
        // Веса карт от 6 до Туза (14)
        this.ranks = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.deck = [];
        this.trumpCard = null;
        this.trumpSuit = null;
        this.table = []; // Массив пар на столе: [{ attacking: {suit, rank, value}, defending: {suit, rank, value} }]
        this.discardPile = []; // Битые карты
    }

    /**
     * Создание и перемешивание колоды из 36 карт
     */
    createDeck() {
        this.deck = [];
        for (let suit of this.suits) {
            for (let rank of this.ranks) {
                this.deck.push({ 
                    suit, 
                    rank, 
                    value: this.ranks.indexOf(rank) + 6 
                });
            }
        }
        // Перемешивание колоды (Алгоритм Фишера-Йетса)
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    /**
     * Инициализация партии и раздача карт игрокам
     * @param {Array} players - Массив объектов игроков [{ id, name, hand: [] }, ...]
     */
    initGame(players) {
        if (!players || players.length < 2) {
            throw new Error('Для игры нужно как минимум 2 игрока.');
        }

        this.createDeck();
        this.table = [];
        this.discardPile = [];

        // Последняя карта в колоде определяет козырь (ложится под низ колоды)
        this.trumpCard = this.deck[this.deck.length - 1];
        this.trumpSuit = this.trumpCard.suit;

        // Раздаем по 6 карт каждому игроку
        players.forEach(player => {
            player.hand = [];
            while (player.hand.length < 6 && this.deck.length > 0) {
                player.hand.push(this.deck.pop());
            }
        });
    }

    /**
     * Проверка, может ли защищающаяся карта побить атакующую
     */
    canBeat(attackingCard, defendingCard) {
        // Если масти равны, то ранг защиты должен быть выше
        if (defendingCard.suit === attackingCard.suit) {
            return defendingCard.value > attackingCard.value;
        }
        // Если защита козырной мастью, а атака обычной — можно
        if (defendingCard.suit === this.trumpSuit && attackingCard.suit !== this.trumpSuit) {
            return true;
        }
        return false;
    }

    /**
     * Проверка, можно ли подбросить карту на стол
     */
    canThrowIn(card) {
        // Если на столе еще пусто, подбрасывать нечего (первую карту кладет атакующий)
        if (this.table.length === 0) return true;

        // Ранг подбрасываемой карты должен совпадать с рангом любой карты, уже имеющейся на столе
        return this.table.some(pair => 
            pair.attacking.rank === card.rank || 
            (pair.defending && pair.defending.rank === card.rank)
        );
    }

    /**
     * Ход игрока: атака или подбрасывание
     * @param {Object} player - Объект игрока
     *  @param {Number} cardIndex - Индекс карты в руке игрока
     */
    attack(player, cardIndex) {
        if (cardIndex < 0 || cardIndex >= player.hand.length) return false;

        const card = player.hand[cardIndex];

        if (this.table.length === 0) {
            // Первая карта кона
            player.hand.splice(cardIndex, 1);
            this.table.push({ attacking: card, defending: null });
            return true;
        } else {
            // Последующие карты можно подбрасывать по общим правилам
            if (this.canThrowIn(card)) {
                player.hand.splice(cardIndex, 1);
                this.table.push({ attacking: card, defending: null });
                return true;
            }
        }
        return false;
    }

    /**
     * Ход защищающегося игрока (побить карту на столе)
     * @param {Object} player - Объект игрока-защитника
     * @param {Number} tablePairIndex - Индекс неотбитой пары на столе
     * @param {Number} cardIndex - Индекс карты в руке игрока, которой бьют
     */
    defend(player, tablePairIndex, cardIndex) {
        const pair = this.table[tablePairIndex];
        // Проверяем, существует ли пара и не отбита ли она уже
        if (!pair || pair.defending !== null) return false;
        if (cardIndex < 0 || cardIndex >= player.hand.length) return false;

        const defendingCard = player.hand[cardIndex];

        if (this.canBeat(pair.attacking, defendingCard)) {
            player.hand.splice(cardIndex, 1);
            pair.defending = defendingCard;
            return true;
        }
        return false;
    }

    /**
     * Защищающийся забирает все карты со стола (если не смог отбиться)
     */
    defenderTakesAll(defender) {
        this.table.forEach(pair => {
            defender.hand.push(pair.attacking);
            if (pair.defending) {
                defender.hand.push(pair.defending);
            }
        });
        this.clearTable();
    }

    /**
     * Отбой: отправка всех карт со стола в сброс (успешная защита)
     */
    clearTable() {
        this.table.forEach(pair => {
            this.discardPile.push(pair.attacking);
            if (pair.defending) {
                this.discardPile.push(pair.defending);
            }
        });
        this.table = [];
    }

    /**
     * Добор карт игрокам из колоды до 6 штук (начинает атакующий, затем остальные)
     */
    refillHands(players) {
        players.forEach(player => {
            while (player.hand.length < 6 && this.deck.length > 0) {
                player.hand.push(this.deck.pop());
            }
        });
    }

    /**
     * Проверка окончания игры (колода пуста и у кого-то из игроков не осталось карт)
     */
    checkGameOver(players) {
        if (this.deck.length > 0) return null;

        const playersWithCards = players.filter(player => player.hand.length > 0);
        
        // Если остался ровно один игрок с картами — он проиграл («дурак»)
        if (playersWithCards.length === 1 && players.length > 1) {
            return playersWithCards[0];
        }
        // Ничья (если карт ни у кого не осталось)
        if (playersWithCards.length === 0) {
            return 'Draw';
        }

        return null;
    }
}

module.exports = DurakGame;
