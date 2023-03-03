var id = 0;
var cardList = document.getElementById('cards');

function appendCard(card) {
    cardList.appendChild(card);
}

function removeCard(card) {
    cardList.removeChild(card);
}

function createCard(id) {
    var card = document.createElement('div');
    document.onclick = function(){displayCard}
    var id = 1;
    card.className = 'card';
    
    return card;
}

function displayCard() {
    cardList.removeChild(card);
}

function addCard(author, versions, description, files) {
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