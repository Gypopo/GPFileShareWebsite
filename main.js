//var query = require('./database/MySQL.js');
var API = require('./api.js');
var cardList = document.getElementById('cards');
var Card = require('./objects/Card.js');
var SearchResults = require('./objects/SearchResults.js');
var Cards = require('./objects/Cards.js');

    //console.log(apiCall());
var cards = new Cards();
var api = new API();

init();

function init() {
    setLoading();
    api.loadCards().then(v => {
        cards = v
    });
}



function appendCard(card) {
    cardList.appendChild(card);
}

function removeCard(card) {
    cardList.removeChild(card);
}

var loading = false;

function setLoading() {
    var loader = document.createElement('div');
    loader.className = 'loader';
    loader.id = 'loader';

    document.body.appendChild(loader);
    loading = true;
}

/**
 * 
 * @param {Map<string, Card>} card 
 */
function completeLoading(cards) {
    if (loading) {
        var loader = document.body.getElementById('loader')
        document.body.removeChild(loader);
    }
}

/**
 * 
 * @param {Card} card 
 */
function createCard(card) {
    var div = document.createElement('div');
    div.onclick = function() {displayCard(div);}
    div.className = 'card';
    div.title = 'Click to show more info';
    setIcon(div);

    //var cards = new Card(1, 'Gypopo', "Cool looking gui layout's", '4am', '#op, #skyblock #survival #basic #cheap #modern #oldSchool french, everyItem', '5.2.4', '1.19, 1.18');
    
    return div;
}

/**
 * 
 * @param {HTMLDivElement} div 
 */
function setIcon(div) {
    var iconFrame = document.createElement('div');
    iconFrame.className = 'icon-frame';

    var icon = document.createElement('div');
    icon.className = 'icon';

    var image = document.createElement('img');
    image.src = 'ESGUI-Coin.png';
    image.style.width = '100%';
    image.style.height = '100%';

    icon.appendChild(image);
    iconFrame.appendChild(icon);
    div.appendChild(iconFrame);
}

function loadCard(uuid, author, mcVersion, plVersion, ) {
    var card = document.createElement('div');
    card.onclick = function() {displayCard(card);}
    card.className = 'card';
    card.title = 'Click to show';
    
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