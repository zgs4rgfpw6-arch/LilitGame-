// Полный маппинг всех карт и рубашки с хостинга Postimages
const cardImages = {
    // Пики (spades / pik)
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

    // Трефы (clubs / tref)
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

    // Бубны (diamonds / bub)
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

    // Червы (hearts)
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

    // Рубашка карты по умолчанию
    'card_back': 'https://i.postimg.cc/YjGwJ56X/Rubaxa.png'
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
            img.src = cardImages['card_back']; 
        } else {
            let key = `${card.suit}_${card.val}`;
            img.src = cardImages[key] || cardImages['card_back'];
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
