// Маппинг карт (сюда подставишь свои ссылки на картинки из Telegram)
const cardImages = {
    'clubs_2': 'ССЫЛКА_ИЗ_ТЕЛЕГРАМА',
    'clubs_3': 'ССЫЛКА_ИЗ_ТЕЛЕГРАМА',
    // ... остальные карты колоды
};

let deck = [];
let playerHand = [];
let dealerHand = [];

function createDeck() {
    const suits = ['clubs', 'spades', 'hearts', 'diamonds'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];
    let newDeck = [];
    
    for (let suit of suits) {
        for (let val of values) {
            newDeck.push({ suit, val, weight: getCardWeight(val) });
        }
    }
    return newDeck.sort(() => Math.random() - 0.5);
}

function getCardWeight(val) {
    if (['j', 'q', 'k'].includes(val)) return 10;
    if (val === 'a') return 11;
    return parseInt(val);
}

function startBlackjack() {
    deck = createDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];

    updateBoard();
    
    document.getElementById('btn-deal').disabled = true;
    document.getElementById('btn-hit').disabled = false;
    document.getElementById('btn-stand').disabled = false;
    document.getElementById('bj-message').innerText = 'Ваш ход!';
}

function playerHit() {
    playerHand.push(deck.pop());
    updateBoard();
    
    let score = calculateScore(playerHand);
    if (score > 21) {
        endGame('Перебор! Вы проиграли.');
    }
}

function playerStand() {
    let dealerScore = calculateScore(dealerHand);
    while (dealerScore < 17) {
        dealerHand.push(deck.pop());
        dealerScore = calculateScore(dealerHand);
    }
    
    let playerScore = calculateScore(playerHand);
    if (dealerScore > 21 || playerScore > dealerScore) {
        endGame('Победа!');
    } else if (playerScore < dealerScore) {
        endGame('Дилер выиграл.');
    } else {
        endGame('Ничья.');
    }
    updateBoard(true);
}

function calculateScore(hand) {
    let score = hand.reduce((sum, card) => sum + card.weight, 0);
    let aces = hand.filter(card => card.val === 'a').length;
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    return score;
}

function renderCards(hand, containerId, hideFirst = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    hand.forEach((card, index) => {
        const img = document.createElement('img');
        img.className = 'bj-card';
        if (hideFirst && index === 0) {
            img.src = 'ССЫЛКА_НА_РУБАШКУ_КАРТЫ'; 
        } else {
            img.src = cardImages[`${card.suit}_${card.val}`] || '';
        }
        container.appendChild(img);
    });
}

function updateBoard(revealDealer = false) {
    renderCards(playerHand, 'player-cards');
    renderCards(dealerHand, 'dealer-cards', !revealDealer);
    
    document.getElementById('player-score').innerText = calculateScore(playerHand);
    document.getElementById('dealer-score').innerText = revealDealer ? calculateScore(dealerHand) : '—';
}

function endGame(message) {
    document.getElementById('bj-message').innerText = message;
    document.getElementById('btn-deal').disabled = false;
    document.getElementById('btn-hit').disabled = true;
    document.getElementById('btn-stand').disabled = true;
}
