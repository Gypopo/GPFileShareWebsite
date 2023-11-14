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
    layout.title = "Click to edit";
    layout.id = id;
    layout.onclick = function () {
        history.pushState(null, null, window.location.href + "?edit=" + id);
        displayCard(id, card);
    }

    var expandIMG = document.createElement('img')
    expandIMG.className = 'expand-card';
    expandIMG.src = 'pics/expand.svg';
    layout.appendChild(expandIMG);

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

function displayCard(id, card) {
    //setViewParam(id);
    //window.location.href = window.location.href + "card?id=" + id;

    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'overlay';

    var content = document.createElement('div');
    content.className = 'overlay-content';

    var title = document.createElement('div');
    title.innerHTML = 'Edit layout:';
    title.className = 'overlay-title';
    content.appendChild(title);

    var box = document.createElement('div');
    box.className = 'overlay-box';

    // Title
    var title = document.createElement('label');
    title.htmlFor = 'editBox_title';
    title.className = 'overlay-editKey';
    title.innerHTML = '<b>Title:</b>';
    box.appendChild(title);
    box.appendChild(addEditBox('title', card.getTitle()));

    // Desc
    var desc = document.createElement('label');
    desc.htmlFor = 'editBox_desc';
    desc.className = 'overlay-editKey';
    desc.innerHTML = '<b>Description:</b>';
    box.appendChild(desc);
    box.appendChild(addEditBox('desc', card.getDescription()));

    //var screenshots = document.createElement('label');
    //screenshots.htmlFor = 'editBox_desc';
    //screenshots.className = 'overlay-editKey';
    //screenshots.innerHTML = '<b>Description:</b>';


    var buttonRow = createButtonRow(id, card);
    box.appendChild(buttonRow);

    content.appendChild(box);

    overlay.appendChild(content);

    document.body.appendChild(overlay);

    //addFilePreviews(id, card);
    // Todo: Allow to remove files from layouts?
}

var mcVersions = [1.20, 1.19, 1.18, 1.17, 1.16, 1.15, 1.14, 1.13, 1.12, 1.11, 1.10, 1.9, 1.8]

function addCheckBoxes() {

}

/**
 * @param {string} value
 * @returns {HTMLDivElement}
 */
function addEditBox(key, value) {
    var editContainer = document.createElement('div');
    editContainer.className = 'editContainer';
    editContainer.title = 'Click to edit';

    var editPencil = document.createElement('img');
    editPencil.className = 'editPencil';
    editPencil.src = 'pics/edit.svg';
    editContainer.appendChild(editPencil);

    var editBox = document.createElement('textarea');
    editBox.className = 'editBox';
    editBox.id = 'editBox_' + key;
    editBox.name = 'editBox_' + key;
    editBox.innerHTML = value.replaceAll('\n', '\r\n');
    if (key === 'title') {
        editBox.maxLength = 32;
    } else if (key === 'desc') {
        editBox.maxLength = 128;
        editBox.style.maxHeight = '100px';
        var lines = value.split(/\r|\r\n|\n/);
        editBox.style.height = (lines.length != 1 ? ((lines.length-1) * 18) + 28 : 30) + 'px';
        editBox.onkeydown = function (e) {
            var box = document.getElementById('editBox_desc');
            if (box.style.height.replace('px', '') >= 100 && e.code === 'Enter') {
                e.preventDefault();
            }
        };
        editBox.setAttribute('oninput', 'this.style.height = "";this.style.height = this.scrollHeight + "px"')
    }

    editContainer.appendChild(editBox);

    return editContainer;
}

/**
 * @param {string} layout
 * @param {Card} card
 * @returns {HTMLDivElement}
 */
function createButtonRow(layout, card) {
    // Button row
    var buttonRow = document.createElement('div');
    buttonRow.className = 'overlay-buttonRow';

    var button1 = document.createElement('button');
    button1.className = 'card-button';
    button1.style.width = '42.5%'
    button1.style.marginRight = '5%';
    button1.style.marginLeft = '5%';
    button1.innerHTML = 'Save & Publish';
    button1.onclick = function () {
        card = saveCard(card);
        api.updateCard(layout, card).then(function (status) {
            if (status) {
            var overlay = document.getElementById('overlay');
            overlay.remove();
            } else {
                alert('Failed to save this card');
            }
        }).catch(function () {
            alert('Failed to save this card');
        });
    }
    buttonRow.appendChild(button1);

    var button2 = document.createElement('button');
    button2.className = 'card-button';
    button2.style.width = '42.5%'
    button2.innerHTML = 'Close';
    button2.onclick = function () {
        var link = window.location.href.split('?')[0];
        history.pushState(null, null, link);

        var overlay = document.getElementById('overlay');
        overlay.remove();
    }
    buttonRow.appendChild(button2);

    return buttonRow;
}

function saveCard(card) {
    var title = document.getElementById('editBox_title').value;
    var lines = document.getElementById('editBox_desc').value.split(/\r|\r\n|\n/);
    var desc = lines[0];
    for (let i = 1; i < lines.length; i++) {
        desc += '\n' + lines[i];
    }

    console.log(desc);

    card.title = title;
    card.description = desc;

    return card;
}

function closeListener(e) {
    var overlay = document.getElementById('overlay');

    if (e.target == overlay) {
        document.body.removeChild(overlay);
        history.pushState(null, null, "/account.html");
    }
}