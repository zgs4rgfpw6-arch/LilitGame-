class DurakGame {
    constructor() {
        this.suits = ['♠', '♣', '♦', '♥'];
        // Веса карт от 6 до Туза (14)
        this.ranks = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.deck = [];
        this.trumpCard = null;
        this.trumpSuit = null;
        this.table = []; // Массив объектов: [{ attacking: {suit, rank}, defending: {suit, rank} }]
        this.attacker = null;
        this.defender = null;
    }

    // Создание и тасование колоды (36 карт)
    createDeck() {
        this.deck = [];
        for (let suit of this.suits) {
            for (let rank of this.ranks) {
                this.deck.push({ suit, rank, value: this.ranks.indexOf(rank) + 6 });
            }
        }
        // Перемешивание (Алгоритм Фишера-Йетса)
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    // Инициализация игры и раздача карт игрокам (по 6 карт)
    initGame(players) {
        this.createDeck();
        
        // Определяем козырь (последняя карта в колоде остается лицом вверх под низом)
        this.trumpCard = this.deck[this.deck.length - 1];
        this.trumpSuit = this.trumpCard.suit;

        // Раздача по 6 карт игрокам
        players.forEach(player => {
            player.hand = [];
            while (player.hand.length < 6 && this.deck.length > 0) {
                player.hand.push(this.deck.pop());
            }
        });
    }

    // Проверка, можно ли побить карту защищающегося
    canBeat(attackingCard, defendingCard) {
        // Масть совпадает, и ранг защищающейся выше
        if (defendingCard.suit === attackingCard.suit) {
            return defendingCard.value > attackingCard.value;
        }
        // Если масть защиты — козырная, а атакующая не козырная
        if (defendingCard.suit === this.trumpSuit && attackingCard.suit !== this.trumpSuit) {
            return true;
        }
        return false;
    }

    // Проверка, можно ли подбросить карту (ранг должен уже присутствовать на столе)
    canThrowIn(card) {
        if (this.table.length === 0) return true;
        
        return this.table.some(pair => 
            pair.attacking.rank === card.rank || 
            (pair.defending && pair.defending.rank === card.rank)
        );
    }

    // Ход атакующего (положить карту на стол)
    attack(player, cardIndex) {
        const card = player.hand[cardIndex];

        if (this.table.length === 0) {
            // Первая карта хода всегда разрешена
            player.hand.splice(cardIndex, 1);
            this.table.push({ attacking: card, defending: null });
            return true;
        } else {
            // Последующие карты можно только подбрасывать
            if (this.canThrowIn(card)) {
                player.hand.splice(cardIndex, 1);
                this.table.push({ attacking: card, defending: null });
                return true;
            }
        }
        return false;
    }

    // Ход защищающегося (побить карту на столе)
    defend(player, tablePairIndex, cardIndex) {
        const pair = this.table[tablePairIndex];
        if (!pair || pair.defending !== null) return false;

        const defendingCard = player.hand[cardIndex];

        if (this.canBeat(pair.attacking, defendingCard)) {
            player.hand.splice(cardIndex, 1);
            pair.defending = defendingCard;
            return true;
        }
        return false;
    }

    // Завершение кона (отбой — карты уходят в сброс)
    clearTable() {
        this.table = [];
    }

    // Защищающийся берет карты (если не смог отбиться)
    defenderTakesAll(defender) {
        this.table.forEach(pair => {
            defender.hand.push(pair.attacking);
            if (pair.defending) {
                defender.hand.push(pair.defending);
            }
        });
        this.clearTable();
    }

    // Добор карт из колоды после кона (до 6 штук)
    refillHands(players) {
        players.forEach(player => {
            while (player.hand.length < 6 && this.deck.length > 0) {
                player.hand.push(this.deck.pop());
            }
        });
    }
}

module.exports = DurakGame;
