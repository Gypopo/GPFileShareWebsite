//var query = require('./database/MySQL.js');
var API = require('./api.js');
var pages = document.getElementById('pages');
var Card = require('./objects/Card.js');
var SearchResults = require('./objects/SearchResults.js');
var Cards = require('./objects/Cards.js');

    //console.log(apiCall());
var cards = new Cards;
var api = new API();

init();

async function init() {
    setLoading();
    try {
        await api.loadCards().then(v => {
            cards.init(v);
            completeLoading();
        });
    } catch(e) {
        if (e.name === 'AbortError') {
            alert('A timeout exception occured while trying to reach the backend server, please report this issue to: https://discord.com/invite/nPyuB4F');
        } else {
            alert('It looks like there was an error while trying to load this page, please report this to our discord at: https://discord.com/invite/nPyuB4F');
        }
        console.log(e);
    }
}

/**
 * @param {Number} i
 * @returns {HTMLElement}
 */
function createPage(i) {
    var page = document.createElement('div');
    page.className = 'page';
    page.id = 'page' + i;

    cards.getPage(i, null).forEach(card => {
        var card = cards.get(e);
        page.appendChild(createCard(card));

    });

    return page;
}

function appendCard(i, card) {
    var page = document.getElementById('page' + i);
    page.appendChild(card);
}

function removeCard(i, card) {
    var page = document.getElementById('page' + i);
    page.removeChild(card);
}

var loading = false;

function setLoading() {
    var loaderFrame = document.createElement('div');
    loaderFrame.className = 'loader-frame';
    loaderFrame.id = 'loader';

    var loader = document.createElement('div');
    loader.className = 'loader';

    loaderFrame.appendChild(loader);
    document.body.appendChild(loaderFrame);
    loading = true;
}

/**
 * 
 * @param {Map<string, Card>} cards
 */
function completeLoading() {
    var page = createPage(1);

    
        var loader = document.getElementById('loader')
        document.body.removeChild(loader);
    

    pages.appendChild(page);
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