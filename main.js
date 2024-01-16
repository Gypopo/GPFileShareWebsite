//var query = require('./database/MySQL.js');
import { API } from './api.js';
var pages = document.getElementById('pages');
import { Card } from './objects/Card.js';
//import SearchResults from './objects/SearchResults.js';
import { Cards } from './objects/Cards.js';
import { Author } from './objects/Author.js';
import { Searchbar } from './searchbar.js';
import { NavBar } from './navbar.js';
import { CardHelper } from './cardhelper.js';

//console.log(apiCall());
var cards = new Cards;
var api = new API();
var cardhelper = new CardHelper(api, cards);
var searchbar = new Searchbar(cardhelper);
var navBar = new NavBar(api);

init();

async function init() {
    setLoading();
    try {
        await api.loadCards().then(v => {
            cards.init(v);
            //console.log(v)
            completeLoading();
        });
    } catch (e) {
        if (e.name === 'AbortError') {
            alert('A timeout exception occured while trying to reach the backend server, please report this issue to: https://discord.gpplugins.com');
        } else {
            alert('It looks like there was an error while trying to load this page, please report this to our discord at: https://discord.gpplugins.com');
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
        page.appendChild(cardhelper.createCard(id, card));
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
    document.getElementById('pages').appendChild(loaderFrame);
    loading = true;
}

async function completeLoading() {
    var page = createPage(1);

    var loader = document.getElementById('loader')
    document.body.removeChild(loader);

    pages.appendChild(page);

    searchbar.initItems(cards);

    if (window.location.href.includes('?')) {
        try {
            var params = new URLSearchParams(window.location.search);
            if (params.has("layout")) {
                var id = params.get("layout");
                if (id === undefined || id === null)
                    throw new Error('Invalid param found');

                var card = cards.get(id);
                if (card === undefined)
                    throw new Error('Cannot find card with ID ' + id);

                if (!params.has("preview")) {
                    // Preview the card
                    cardhelper.displayCard(id, card);
                } else {
                    // Preview the file
                    var file = params.get("preview");
                    if (card.getFiles().includes(file)) {
                        await api.previewFile(params.get("layout"), file).then(v => {
                            cardhelper.previewFile(id, file, v);
                        });
                    } else throw new Error('Cannot find file ' + file + ' inside layout ' + card);
                }
            }
        } catch (e) {
            console.log(e);
            history.pushState(null, null, "/");
        }
    }
}

function loadCard(uuid, author, mcVersion, plVersion,) {
    var card = document.createElement('div');
    card.onclick = function () { displayCard(card); }
    card.className = 'card';
    card.title = 'Click to show';

    return card;
}

/**
 * @param {string} id
 */
function setViewParam(id) {
    var url = "/cards/layout.html?id=" + id;
    window.location.href = url;
}