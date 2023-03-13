(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var Card = require('./objects/Card.js');

module.exports = class API {

    /**
    * @returns {Promise<Map<string, Card>>}.
    */
    async loadCards() {
        var response = await this.fetchWithTimeout('http://192.168.55.170:3333/api/getFiles', {
            method: 'GET',
            timeout: 15000
          });

        var raw = await response.text();
        var values = new Map(JSON.parse(raw));

        var cards = [];
        for (var [key, value] of new Map(JSON.parse(raw))) {
            cards.set(key, new Card(JSON.parse(JSON.stringify(value))));
        }
        console.log(cards);

        return cards;
    }

    /**
    * @returns {Promise<Response>}
    */
    async fetchWithTimeout(resource, options = {}) {
        var { timeout = 8000 } = options;
        
        var controller = new AbortController();
        var id = setTimeout(() => controller.abort(), timeout);
        var response = await fetch(resource, {
          ...options,
          signal: controller.signal  
        });
        clearTimeout(id);

        return response;
      }

}
},{"./objects/Card.js":3}],2:[function(require,module,exports){
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
},{"./api.js":1,"./objects/Card.js":3,"./objects/Cards.js":4,"./objects/SearchResults.js":5}],3:[function(require,module,exports){
module.exports = class Card {
    constructor(id, author, description, createDate, tags, pluginVersion, mcVersion) {
        this.id = id;
        this.author = author;
        this.desc = description;
        this.creation = createDate;
        this.tags = new Array(tags);
        this.plVer = pluginVersion;
        this.mcVer = mcVersion;
    }
}
},{}],4:[function(require,module,exports){
const SearchResults = require("./SearchResults");

module.exports = class Cards {

    pageSize;
    cards;

    /**
     * @param {Map<string, Card>} cards
     */
    init(cards) {
        this.cards = cards;
        this.pageSize = 5;
    }

    /**
     * @return {Map<string, Card>}
     */
    get() {
        return this.cards;
    }

    /**
     * @param {string} id
     * @param {Card} card
     */
    add(id, card) {
        this.cards.set(id, card);
    }

    /**
     * @param {number} p
     * @param {SearchResults} filter
     * @return {Map<string, Card>}
     */
    getPage(p, filter) {
        var cards = new Map();
        var i = p*this.pageSize-this.pageSize;
        while (e < cards.size && e < 30) {
            var card = cards.get(e);
        }
    }
}
},{"./SearchResults":5}],5:[function(require,module,exports){
// Cashed search result
module.exports = class SearchResults {
    constructor() {
        this.byTag = new Map();
        this.byAuthor = new Map();
    }

    /**
     * @param {Array<string>} tags
     */
    getByTag(tags) {
        if (this.byTag.has(tags)) {
            
        }
    }

    /**
     * @param {Array<string>} tags
     * @param {Map<string, Card>} cards
     */
    byTag(tags, cards) {
        this.byTag.set(tags, cards);
    }
}
},{}]},{},[2]);
