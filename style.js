var cardList = document.getElementById('cards');

function appendCard(card) {
    cardList.appendChild(card);
}

function createCard() {
    var card = document.createElement('div');
    card.className = 'card';
    
    return card;
}

appendCard(createCard());
appendCard(createCard());
appendCard(createCard());
appendCard(createCard());
appendCard(createCard());
appendCard(createCard());
appendCard(createCard());
appendCard(createCard());