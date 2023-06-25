//var query = require('./database/MySQL.js');
import {API} from './api.js';
var pages = document.getElementById('pages');
import {Card} from './objects/Card.js';
//import SearchResults from './objects/SearchResults.js';
import {Cards} from './objects/Cards.js';
import {Author} from './objects/Author.js';

    //console.log(apiCall());
var cards = new Cards;
var api = new API();

init();

async function init() {
    setLoading();
    try {
        await api.loadCards().then(v => {
            cards.init(v);
            //console.log(v)
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

    cards.getPage(i, null).forEach((card, id) => {
        //console.log(id);
        //console.log(id);
        page.appendChild(createCard(id, card));
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

function completeLoading() {
    var page = createPage(1);

    
        var loader = document.getElementById('loader')
        document.body.removeChild(loader);
    

    pages.appendChild(page);
}

/**
 * @param {string} id
 * @param {Card} card 
 */
function createCard(id, card) {
    var div = document.createElement('div');
    div.onclick = function() {displayCard(div, card);}
    div.className = 'card';
    div.id = id;
    div.title = 'Click to show more info';
    if (card.isPremium()) {
        tagPremium(div);
    }
    setIcon(div);
    addSeperator(div);
    addContainer(div, card);

    //var cards = new Card(1, 'Gypopo', "Cool looking gui layout's", '4am', '#op, #skyblock #survival #basic #cheap #modern #oldSchool french, everyItem', '5.2.4', '1.19, 1.18');
    
    return div;
}

/**
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

/**
 * @param {HTMLDivElement} div 
 */
function tagPremium(div) {
    var tag = document.createElement('div');
    tag.className = 'premium';
    tag.innerHTML = 'Premium';

    div.appendChild(tag);
}

/**
 * @param {HTMLDivElement} div
 * @param {Card} card
 */
function addContainer(div, card) {
    var container = document.createElement('div');
    container.className = 'container';

    appendMCVersions(container, card);
    appendAuthor(container, card);
    appendTags(container, card);
    
    div.appendChild(container);
}

/**
 * @param {HTMLDivElement} div
 * @param {Card} card
 */
function appendMCVersions(div, card) {
    var versions = document.createElement('div');
    versions.className = 'versions';
    versions.innerHTML = '<b>MC Versions: </b>' + card.getMinecraftVersion();

    div.appendChild(versions);
}

/**
 * @param {HTMLDivElement} div
 * @param {Card} card
 */
function appendAuthor(div, card) {
    var author = document.createElement('div');
    author.className = 'author';
    author.innerHTML = '<b>Author: </b>' + card.getAuthor().getAuthor();

    div.appendChild(author);
}

/**
 * @param {HTMLDivElement} div
 * @param {Card} card
 */
function appendTags(div, card) {
    var tags = document.createElement('div');
    tags.className = 'tags';
    tags.innerHTML = '<b>Tags: </b>'

    var tagDiv = document.createElement('div');
    tagDiv.className = 'tags tag';

    var tag = '';
    for(var i of card.getTags()) {
       tag = tag + '#' + i + ' ';
    }
    tagDiv.innerHTML = tag;

    tags.appendChild(tagDiv);
    div.appendChild(tags);
}

/**
 * @param {HTMLDivElement} div 
 */
function addSeperator(div) {
    var seperator = document.createElement('div');
    seperator.className = 'seperator';
    
    var line = document.createElement('hr');
    line.size = 2;
    line.width = '75%';
    line.color = 'black';

    seperator.appendChild(line);
    div.appendChild(seperator);
}

function loadCard(uuid, author, mcVersion, plVersion, ) {
    var card = document.createElement('div');
    card.onclick = function() {displayCard(card);}
    card.className = 'card';
    card.title = 'Click to show';
    
    return card;
}

function displayCard(div, card) {
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