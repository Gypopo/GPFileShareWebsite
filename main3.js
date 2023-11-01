import { API } from './api.js';
import { User } from './objects/User.js';
import { NavBar } from './navbar.js';

var api = new API();
var navBar = new NavBar(api);

init();

function init() {
    var remember = api.getCookie('remember');
    var token = api.getCookie('token');
    api.getUserData().then(user => {
        if (user === null && token != null && token != '') {
            api.retrieveUserData(token, remember).then(user => {
                if (user != null) {
                    navBar.refresh(user);
                    initPage(user);
                } else {
                    console.warn('Failed to login');
                    //forceLogin();
                }
            });
        } else {
            console.warn(user.getUsername());
            initPage(user);
        }
    });
}

/**
 * @param {User} user
 */
function initPage(user) {
    var container = document.getElementById('cardsContainer');

    api.getCardsByAuthorID(user.getUserID()).then(cards => {
        console.log(cards);
        cards.forEach((card, id) => {
            container.appendChild(createCard(id, card));
        });
    });
}

function forceLogin() {
    var url = "http://192.168.55.200:5500/login.html";

    var element = document.createElement('a');
    element.style.display = 'none';
    element.href = url;
    element.click();
    element.remove();
}

/**
 * 
 * @param {string} id 
 * @param {Card} card 
 * @returns {HTMLDivElement}
 */
function createCard(id, card) {
    var layout = document.createElement('div');
    layout.className = 'layout-card';
    layout.title = card.getTitle();
    layout.id = id;
    
    var title = document.createElement('div');
    title.innerHTML = '<b>Title:</b> ' + card.getTitle();
    title.style.marginBottom = '2.5px'
    layout.appendChild(title);

    var d = new Date();
    d.setTime(card.getCreation());

    var creationDate = document.createElement('div');
    creationDate.innerHTML = '<b>Creation date:</b> ' + d.toUTCString();
    creationDate.style.marginBottom = '2.5px'
    layout.appendChild(creationDate);

    var downloads = document.createElement('div');
    downloads.innerHTML = '<b>Downloads:</b> ' + card.getDownloads();
    layout.appendChild(downloads);

    return layout;
}