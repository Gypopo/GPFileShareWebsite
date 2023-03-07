//var query = require('./database/MySQL.js');
var apiCall = require('./api.js');
var cardList = document.getElementById('cards');

    //console.log(apiCall());
    apiCall().then(v => console.log(v));



function appendCard(card) {
    cardList.appendChild(card);
}

function removeCard(card) {
    cardList.removeChild(card);
}

function createCard(id) {
    var card = document.createElement('div');
    card.onclick = function() {displayCard(card);}
    card.className = 'card';
    var cards = new Card(1, 'Gypopo', "Cool looking gui layout's", '4am', '#op, #skyblock #survival #basic #cheap #modern #oldSchool french, everyItem', '5.2.4', '1.19, 1.18');
    
    return card;
}

function loadCard(uuid, author, mcVersion, plVersion, ) {
    var card = document.createElement('div');
    card.onclick = function() {displayCard(card);}
    card.className = 'card';
    
    return card;
}

function displayCard(card) {
    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'overlay';
    overlay.innerText = "test";

    var content = document.createElement('div');
    content.className = 'overlay content';
    overlay.appendChild(content);

    overlay.onclick = closeListener;

    document.body.appendChild(overlay);
}

function closeListener(e) {
    var overlay = document.getElementById('overlay');
    
    if (e.target == overlay) {
        document.body.removeChild(overlay);
    }
}

appendCard(createCard());
appendCard(createCard());
appendCard(createCard());
appendCard(createCard());
appendCard(createCard());
appendCard(createCard());
appendCard(createCard());
appendCard(createCard());