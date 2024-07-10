import { API } from './api.js';
import { User } from './objects/User.js';
import { NavBar } from './navbar.js';
import { RawFile } from './objects/RawFile.js';
import { CachedImages } from './objects/CachedImages.js';

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
    box.id = 'overlay-box';

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

    // CDN?
    // Screenshots
    var screenshots = document.createElement('label');
    screenshots.htmlFor = 'editBox_screenshots';
    screenshots.className = 'overlay-editKey';
    screenshots.innerHTML = '<b>Screenshots:</b>';
    box.appendChild(screenshots);

    var currentSS = document.createElement('ul');
    currentSS.className = 'screenshots';
    currentSS.id = 'currentSS';
    box.appendChild(currentSS);

    var cached = new CachedImages(api, id);
    cached.onload = function(files) {
        addCurrentSS(files);
    }

    //var ssAddBoxLabel = document.createElement('label');
    //ssAddBoxLabel.htmlFor = 'ss_input';
    //ssAddBoxLabel.innerHTML = 'Upload screenshots:';
    //box.appendChild(ssAddBoxLabel);

    var ssAddInput = document.createElement('input');
    ssAddInput.type = 'file';
    ssAddInput.id = 'ss_input';
    ssAddInput.accept = 'image/*';
    ssAddInput.style.display = 'none';
    ssAddInput.setAttribute('multiple', '');
    ssAddInput.onchange = function (e) {
        var files = e.target.files;
        var allowedTypes = ['image/jpeg', 'image/png'];
        var rawFiles = [];

        for (var file of files) {
            if (!allowedTypes.includes(file.type)) {
                alert('❌ File ' + file.name + ' could not be uploaded. Only images with the following types are allowed: JPG, PNG.');
                return;
            }

            if (file.size >= 10485760) {
                alert('❌ File ' + file.name + ' could not be uploaded. File is to large, maximum file size is 10MB!');
                return;
            }

            if (cached.cached.some(c => file.name === c.fileName) || rawFiles.some(f => file.name === f.fileName)) {
                alert('❌ File ' + file.name + ' could not be uploaded. Already a file with that name exists!');
                return;
            }

            var reader = new FileReader();

            reader.onload = function (event) {
                var arrayBuffer = event.target.result;
                var byteArray = new Uint8Array(arrayBuffer);

                var blob = new Blob([byteArray], { type: file.type });
                rawFiles.push(new RawFile(file.name, byteArray));

                addUploaded(file.name, URL.createObjectURL(blob));
            };

            reader.onerror = function (event) {
                alert('❌ File ' + file.name + ' could not be uploaded. File could not be read');
                console.error('File ' + file.name + ' could not be read! Code ' + event.target.error.code);
                return;
            };

            reader.readAsArrayBuffer(file);
        }
    }

    var ssAddButton = document.createElement('div');
    ssAddButton.id = 'ss_button';
    ssAddButton.className = 'ss_button';
    ssAddButton.name = 'ss_button';
    ssAddButton.innerHTML = 'Upload screenshot';
    ssAddButton.onclick = function () {
        ssAddInput.click();
    }

    ssAddButton.appendChild(ssAddInput);
    box.appendChild(ssAddButton);

    var uploaded = document.createElement('ul');
    uploaded.className = 'screenshots';
    uploaded.id = 'uploaded';
    box.appendChild(uploaded);

    var buttonRow = createButtonRow(id, card);
    box.appendChild(buttonRow);

    content.appendChild(box);

    overlay.appendChild(content);

    document.body.appendChild(overlay);

    //addFilePreviews(id, card);
    // Todo: Allow to remove files from layouts?
}

function addUploaded(name, url) {
    var uploaded = document.getElementById('uploaded');

    var ssElement = document.createElement('li');
    var ss = document.createElement('a');
    ss.innerText = name;
    ss.href = url;
    ss.target = '_blank';
    ssElement.append(ss);
    uploaded.appendChild(ssElement);
}

async function addCurrentSS(files) {
    var currentSS = document.getElementById('currentSS');
    for (var file of files) {
        var ssElement = document.createElement('li');
        ssElement.id = file.fileName;

        var ss = document.createElement('a');
        ss.innerText = file.fileName;
        ss.href = file.url;
        ss.target = '_blank';
        ss.style.color = 'white';
        ssElement.append(ss);
        
        ssElement.append(getDeleteBtn(file.fileName));

        currentSS.appendChild(ssElement);
    }
}

function getDeleteBtn(file) {
    var delBtn = document.createElement('img');
    delBtn.style.position = 'inline-block';
    delBtn.src = 'pics/x-10332.svg';
    delBtn.style.height = '10px';
    delBtn.style.marginLeft = '5px';
    delBtn.style.cursor = 'pointer';
    delBtn.title = 'Click to remove this screenshot';
    delBtn.addEventListener("click", () => {
        removeScreenshot(file);
    });
    
    return delBtn;
}

function removeScreenshot(file) {
    var currentSS = document.getElementById('currentSS');
    var ssEntry = document.getElementById(file);
    ssEntry.remove();

    var array;
    if (currentSS.hasAttribute('removedSS')) {
        array = JSON.parse(currentSS.getAttribute('removedSS'));
    } else {
        array = new Array();
    }
    array.push(file);

    currentSS.setAttribute('removedSS', JSON.stringify(array));
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
        editBox.style.height = (lines.length + 1 != 1 ? ((lines.length + 1 - 1) * 18) + 28 : 30) + 'px';
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
    button1.style.width = '30%'
    button1.style.marginRight = '5%';
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

        // CDN?
        var files = document.getElementById('ss_input').files;
        if (files.length != 0) {
            api.uploadScreenshots(layout, files, files[0].type).then(function (status) {
                if (!status) {
                    alert('Failed to upload screenshots');
                }
            });
        }

        var removedSS = document.getElementById('currentSS').getAttribute('removedSS');
        if (removedSS != null) {
            api.removeScreenshots(layout, removedSS).then(function (status) {
                if (!status) {
                    alert('Failed to remove screenshots');
                }
            });
        }
    }
    buttonRow.appendChild(button1);

    var button3 = document.createElement('button');
    button3.className = 'card-button';
    button3.style.width = '30%'
    button3.style.marginRight = '5%';
    button3.innerHTML = 'Delete layout';
    button3.onclick = function () {
        api.deleteLayout(layout).then(function () {
            var overlay = document.getElementById('overlay');
            overlay.remove();
        });
    }
    buttonRow.appendChild(button3);

    var button2 = document.createElement('button');
    button2.className = 'card-button';
    button2.style.width = '30%'
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

    var uploadedSS = document.getElementById('ss_input').files.length;
    card.screenshots = card.screenshots + uploadedSS;

    var removedSS = document.getElementById('currentSS').getAttribute('removedSS');
    if (removedSS != null)
        card.screenshots = card.screenshots - JSON.parse(removedSS).length;

    return card;
}

function closeListener(e) {
    var overlay = document.getElementById('overlay');

    if (e.target == overlay) {
        document.body.removeChild(overlay);
        history.pushState(null, null, "/account.html");
    }
}