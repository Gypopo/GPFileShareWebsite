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

async function completeLoading() {
    var page = createPage(1);

    var loader = document.getElementById('loader')
    document.body.removeChild(loader);
    

    pages.appendChild(page);

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
                    displayCard(id, card);
                } else {
                    // Preview the file
                    var file = params.get("preview");
                    if (card.getFiles().includes(file)) {
                        await api.previewFile(params.get("layout"), file).then(v => {
                            previewFile(id, file, v);
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

/**
 * @param {string} id
 * @param {Card} card 
 */
function createCard(id, card) {
    var div = document.createElement('div');
    div.onclick = function() {
        history.pushState(null, null, window.location.href + "?layout=" + id);
        displayCard(id, card);
    }
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
    image.src = 'pics/ESGUI-Coin.png';
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
    versions.innerHTML = '<b>MC Versions: </b>' + card.getMinecraftVersions();

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
    line.style.border = '2px solid';
    line.style.borderColor = 'black';
    line.style.backgroundColor = 'black';

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

/**
 * @param {string} id
 * @param {Card} card 
 */
function displayCard(id, card) {
    //setViewParam(id);
    //window.location.href = window.location.href + "card?id=" + id;
    
    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'overlay';

    var content = document.createElement('div');
    content.className = 'overlay-content';

    var title = document.createElement('div');
    title.innerHTML = 'Quick overview:';
    title.className = 'overlay-title';
    content.appendChild(title);
    
    var box = document.createElement('div');
    box.className = 'overlay-box';

    // Desc
    var desc = document.createElement('div');
    desc.className = 'overlay-desc';
    desc.innerHTML = '<b>Description: </b>' + card.getDescription();
    desc.title = card.getDescription();
    box.appendChild(desc);

    // MC Version
    var mcVer = document.createElement('div');
    mcVer.className = 'overlay-ver';
    mcVer.innerHTML = '<b>MC version(s): </b>' + card.getMinecraftVersions();
    box.appendChild(mcVer);

    // Plugin version
    var plVer = document.createElement('div');
    plVer.className = 'overlay-ver';
    plVer.innerHTML = '<b>Plugin version: </b>' + card.getPluginVersion();
    box.appendChild(plVer);

    // Layout files
    var filesBox = document.createElement('div');
    filesBox.className = 'overlay-filesBox';
    filesBox.innerHTML = '<b>Click any file to preview:</b>';

    // Files
    var files = document.createElement('div');
    files.className = 'overlay-files';
    files.innerHTML = getFiles(card);
    filesBox.append(files);
    box.appendChild(filesBox);

    var buttonRow = createButtonRow(id);
    box.appendChild(buttonRow);
    
    content.appendChild(box);

    overlay.appendChild(content);
    overlay.onclick = closeListener;

    document.body.appendChild(overlay);

    addFilePreviews(id, card);
}

/**
 * @param {string} layout
 * @param {Card} card
 * @returns {string}
 */
function getFiles(card) {
    var html = '';
    var files = card.getFiles();
    for (let i = 0; i < files.length; i++) {
        html += '<a style="cursor: pointer;color:blue;text-decoration:underline;" id="previewFile=' + files.at(i) + '">' + files.at(i) + '</a>';
        if (i != files.length-1) {
            html += ' - ';
        }
    }
    
    return html;
}

/**
 * @param {string} layout
 * @param {Card} card
 */
function addFilePreviews(layout, card) {
    var files = card.getFiles();
    for (let i = 0; i < files.length; i++) {
        var file = document.getElementById("previewFile=" + files.at(i));
        file.addEventListener("click", function() {
            fastPreview(layout, files.at(i));
        });
    }
}

/**
 * @param {string} layout
 * @param {string} file 
 */
async function fastPreview(layout, file) {
    var link = window.location.href + '&preview=' + file;
    //window.location.href = link;
    history.pushState(null, null, link);

    await api.previewFile(layout, file).then(v => {
        var overlay = document.getElementById('overlay');
        overlay.remove();

        previewFile(layout, file, v);
    });

}

/**
 * @param {string} layout 
 * @param {string} payload
 * @param {string} file 
 */
function previewFile(layout, file, payload) {
    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'overlay';

    var content = document.createElement('div');
    content.className = 'overlay-content';

    var title = document.createElement('div');
    title.innerHTML = 'File preview:';
    title.className = 'overlay-title';
    content.appendChild(title);
    
    var box = document.createElement('div');
    box.className = 'overlay-box';
    box.innerHTML = '<pre style="max-height:545px;"><code class="language-yaml" id="yamlCode">' + payload + "</code></pre>";

    var buttonRow = createPreviewButtonRow(layout);
    box.appendChild(buttonRow);

    content.appendChild(box);

    overlay.appendChild(content);
    overlay.onclick = closeListener;

    document.body.appendChild(overlay);

    Prism.highlightAll();
}

/**
 * @param {string} layout
 * @returns {HTMLDivElement}
 */
function createPreviewButtonRow(layout) {
    // Button row
    var buttonRow = document.createElement('div');
    buttonRow.className = 'overlay-buttonRow';

    var button1 = document.createElement('button');
    button1.className = 'preview-button';
    button1.innerHTML = 'Download';
    button1.onclick = function () {

    }
    buttonRow.appendChild(button1);

    var button2 = document.createElement('button');
    button2.className = 'preview-button';
    button2.innerHTML = '<- Back';
    button2.onclick = function () {
        var link = window.location.href.split('?')[0] + '?layout=' + layout;
        history.pushState(null, null, link);

        var overlay = document.getElementById('overlay');
        overlay.remove();
        
        displayCard(layout, cards.get(layout));
    }
    buttonRow.appendChild(button2);

    return buttonRow;
}

/**
 * @param {string} layout
 * @returns {HTMLDivElement}
 */
function createButtonRow(layout) {
    // Button row
    var buttonRow = document.createElement('div');
    buttonRow.className = 'overlay-buttonRow';

    var button1 = document.createElement('button');
    button1.className = 'card-button';
    button1.style.marginRight = '5%';
    button1.innerHTML = 'Download';
    button1.onclick = function () {
        startDownload();
        api.downloadLayout(layout, cards.get(layout))
    }
    buttonRow.appendChild(button1);

    var button3 = document.createElement('button');
    button3.className = 'card-button';
    button3.style.marginRight = '5%';
    button3.innerHTML = 'Get install command';
    button3.onclick = function () {

    }
    buttonRow.appendChild(button3);

    var button2 = document.createElement('button');
    button2.className = 'card-button';
    button2.innerHTML = '<- Back';
    button2.onclick = function () {
        var link = window.location.href.split('?')[0];
        history.pushState(null, null, link);

        var overlay = document.getElementById('overlay');
        overlay.remove();
    }
    buttonRow.appendChild(button2);

    return buttonRow;
}

function startDownload() {
    var overlay = document.createElement('div');
    overlay.className = 'confirm';
    overlay.id = 'confirm';

    var content = document.createElement('div');
    content.className = 'confirm content-small';
    content.id = 'confirm content-small';
    content.innerHTML = '<div class="download-loader"></div>Downloading...';

    overlay.appendChild(content);

    document.body.appendChild(overlay);
}

/**
 * @param {string} id
 */
function setViewParam(id) {
    var url = "/cards/layout.html?id=" + id;
    window.location.href = url;
}

function closeListener(e) {
    var overlay = document.getElementById('overlay');
    
    if (e.target == overlay) {
        document.body.removeChild(overlay);
        history.pushState(null, null, "/");
    }
}