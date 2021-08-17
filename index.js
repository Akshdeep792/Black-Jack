// alert("Hello");
let blackjackgame = {
    'you': { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'dealer': { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'Q', 'J', 'A'],
    'cardsMap': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'Q': 10, 'J': 10, 'A': [1, 11] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnOver': false,
};

const YOU = blackjackgame['you'];
const DEALER = blackjackgame['dealer'];

const hitsound = new Audio('sounds/swish.m4a');
const winsound = new Audio('sounds/cash.mp3');
const lostsound = new Audio('sounds/aww.mp3');


document.querySelector('#hit-btn').addEventListener('click', blackjackHit);

document.querySelector('#stand-btn').addEventListener('click', dealerLogic);

document.querySelector('#deal-btn').addEventListener('click', blackjackDeal);

function blackjackHit() {
    if (blackjackgame['isStand'] === false) {
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackgame['cards'][randomIndex];
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitsound.play();
    }
}

function blackjackDeal() {
    if (blackjackgame['turnOver'] === true) {

        blackjackgame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        for (var i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }
        for (var i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#your-blackjack-result').style.color = 'white';

        document.querySelector('#dealer-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').style.color = 'white';

        document.querySelector('#blackjack-result').textContent = 'Lets Play!';
        document.querySelector('#blackjack-result').style.color = 'goldenrod';

        blackjackgame['turnOver'] = true;
    }
}

function updateScore(card, activePlayer) {
    if (card === 'A') {
        if (activePlayer['score'] + blackjackgame['cardsMap'][1] <= 21) {
            activePlayer['score'] += blackjackgame['cardsMap'][card][1];
        }
        else {
            activePlayer['score'] += blackjackgame['cardsMap'][card][0];
        }
    }
    else {
        activePlayer['score'] += blackjackgame['cardsMap'][card];
    }
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
    else
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
}

function sleep(ms){
    return  new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic() { 
    blackjackgame['isStand'] = true;

    while (DEALER['score'] < 16 && blackjackgame['isStand'] === true) {


        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);

    }

    if (DEALER['score'] > 15) {

        blackjackgame['turnOver'] = true;
        let winner = computeWinner();
        showResult(winner);
        console.log(blackjackgame['turnOver']);
    }
    // blackjackgame['turnOver'] = true;
    // let winner = computeWinner();
    // showResult(winner);
}


function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            blackjackgame['wins']++;
            winner = YOU;
        }
        else if (YOU['score'] < DEALER['score']) {
            blackjackgame['losses']++;
            winner = DEALER;
        }
        else if (YOU['score'] === DEALER['score']) {
            blackjackgame['draws']++;

        }
    }

    else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjackgame['losses']++;
        winner = DEALER;
    }
    else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackgame['draws']++;

    }
    console.log(blackjackgame);
    return winner;
}

function showResult(winner) {
    let message, messageColor;

    if (blackjackgame['turnOver'] === true) {

        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackjackgame['wins'];
            messsage = 'You won!';
            messageColor = 'goldenrod';
            winsound.play();
        }
        else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackgame['losses'];

            message = 'You Lost!';
            messageColor = 'goldenrod';
            lostsound.play(); 

        }

        else {
            document.querySelector('#draws').textContent = blackjackgame['draws'];
            message = 'You drew!';
            messageColor = 'goldenrod';
        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}
