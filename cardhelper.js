import { Card } from './objects/Card.js';
import { Cards } from './objects/Cards.js';
import { Author } from './objects/Author.js';

export class CardHelper {
    /**
     * @param {string} id
     * @param {Card} card 
     */
    createCard(id, card) {
        var div = document.createElement('div');
        div.onclick = function () {
            history.pushState(null, null, window.location.href + "?layout=" + id);
            displayCard(id, card);
        }
        div.className = 'card';
        div.id = id;
        div.title = 'Click to show more info';
        if (card.isPremium()) {
            this.tagPremium(div);
        }
        this.setIcon(div);
        this.addSeperator(div);
        this.addContainer(div, card);

        //var cards = new Card(1, 'Gypopo', "Cool looking gui layout's", '4am', '#op, #skyblock #survival #basic #cheap #modern #oldSchool french, everyItem', '5.2.4', '1.19, 1.18');

        return div;
    }

    /**
     * @param {HTMLDivElement} div 
     */
    setIcon(div) {
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
    tagPremium(div) {
        var tag = document.createElement('div');
        tag.className = 'premium';
        tag.innerHTML = 'Premium';

        div.appendChild(tag);
    }

    /**
     * @param {HTMLDivElement} div
     * @param {Card} card
     */
    addContainer(div, card) {
        var container = document.createElement('div');
        container.className = 'cardContainer';

        this.appendDownloads(container, card);
        //appendMCVersions(container, card);
        this.appendTitle(container, card);
        this.appendAuthor(container, card);
        this.appendTags(container, card);

        div.appendChild(container);
    }

    /**
     * @param {HTMLDivElement} div
     * @param {Card} card
     */
    appendMCVersions(div, card) {
        var versions = document.createElement('div');
        versions.className = 'versions';
        versions.innerHTML = '<b>MC Versions: </b>' + card.getMinecraftVersions();

        div.appendChild(versions);
    }

    /**
     * @param {HTMLDivElement} div
     * @param {Card} card
     */
    appendAuthor(div, card) {
        var author = document.createElement('div');
        author.className = 'author';
        author.innerHTML = '<b>Author: </b>' + card.getAuthor().getAuthor();

        div.appendChild(author);
    }

    /**
     * @param {HTMLDivElement} div
     * @param {Card} card
     */
    appendTitle(div, card) {
        var author = document.createElement('div');
        author.className = 'author';
        author.innerHTML = '<b>Title: </b>' + card.getTitle();

        div.appendChild(author);
    }

    /**
     * @param {HTMLDivElement} div
     * @param {Card} card
     */
    appendTags(div, card) {
        var tags = document.createElement('div');
        tags.className = 'tags';
        tags.innerHTML = '<b>Tags: </b>'

        var tagDiv = document.createElement('div');
        tagDiv.className = 'tags tag';

        var tag = '';
        for (var i of card.getTags()) {
            tag = tag + '#' + i + ' ';
        }
        tagDiv.innerHTML = tag;

        tags.appendChild(tagDiv);
        div.appendChild(tags);
    }

    /**
     * @param {HTMLDivElement} div
     * @param {Card} card
     */
    appendDownloads(div, card) {
        var container = document.createElement('div');
        container.style.position = 'relative';

        var downloadCount = document.createElement('div');
        downloadCount.className = 'downloadCount';
        downloadCount.innerHTML = '<img src="pics/download.svg" height=20></img> ' + card.getDownloads();
        container.appendChild(downloadCount);

        div.appendChild(container);
    }

    /**
     * @param {HTMLDivElement} div 
     */
    addSeperator(div) {
        var seperator = document.createElement('div');
        seperator.className = 'seperator';

        var line = document.createElement('hr');
        line.style.border = '2px solid';
        line.style.borderColor = 'black';
        line.style.backgroundColor = 'black';

        seperator.appendChild(line);
        div.appendChild(seperator);
    }

    /**
 * @param {string} id
 * @param {Card} card 
 */
    displayCard(id, card) {
        //setViewParam(id);
        //window.location.href = window.location.href + "card?id=" + id;

        var overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.id = 'overlay';

        var content = document.createElement('div');
        content.className = 'overlay-content';

        var title = document.createElement('div');
        title.innerHTML = 'Layout overview:';
        title.className = 'overlay-title';
        content.appendChild(title);

        var box = document.createElement('div');
        box.className = 'overlay-box';

        // Verified author?
        if (card.getAuthor().getMethod() == 'DISCORD') {
            var verifiedCheck = document.createElement('img');
            verifiedCheck.src = 'pics/verified-author.svg'
            verifiedCheck.title = 'The author of this layout verified thru discord';
            verifiedCheck.className = 'overlay-verifiedAuthor';
            content.appendChild(verifiedCheck);
        }

        // Title
        var title = document.createElement('div');
        title.className = 'overlay-layoutTitle';
        title.innerHTML = '<b>Title: </b>' + card.getTitle();
        title.title = card.getTitle();
        box.appendChild(title);

        // Desc
        var desc = document.createElement('div');
        desc.className = 'overlay-desc';
        desc.innerHTML = '<b>Description: </b>' + card.getDescription();
        desc.title = card.getDescription();
        box.appendChild(desc);

        // MC Version
        var mcVer = document.createElement('div');
        mcVer.className = 'overlay-ver';
        mcVer.innerHTML = '<b>Tested MC version(s): </b>' + card.getMinecraftVersions();
        box.appendChild(mcVer);

        // Plugin version
        var plVer = document.createElement('div');
        plVer.className = 'overlay-ver';
        plVer.innerHTML = '<b>Plugin version: </b>' + card.getPluginVersion();
        box.appendChild(plVer);

        // Creation date
        var d = new Date();
        d.setTime(card.getCreation());

        var creationDate = document.createElement('div');
        creationDate.className = 'overlay-creationDate';
        creationDate.innerHTML = '<b>Creation date: </b>' + d.toUTCString();
        box.appendChild(creationDate);

        var creationDate = document.createElement('div');
        creationDate.innerHTML = '<b>Shop count: </b>' + card.getFiles().length;
        box.appendChild(creationDate);

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
    getFiles(card) {
        var html = '';
        var files = card.getFiles();
        for (let i = 0; i < files.length; i++) {
            html += '<a style="cursor: pointer;color:blue;text-decoration:underline;" id="previewFile=' + files.at(i) + '">' + files.at(i) + '</a>';
            if (i != files.length - 1) {
                html += ' - ';
            }
        }

        return html;
    }

    /**
     * @param {string} layout
     * @param {Card} card
     */
    addFilePreviews(layout, card) {
        var files = card.getFiles();
        for (let i = 0; i < files.length; i++) {
            var file = document.getElementById("previewFile=" + files.at(i));
            file.addEventListener("click", function () {
                fastPreview(layout, files.at(i));
            });
        }
    }

    /**
     * @param {string} layout
     * @param {string} file 
     */
    async fastPreview(layout, file) {
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
    previewFile(layout, file, payload) {
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
    createPreviewButtonRow(layout) {
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
    createButtonRow(layout) {
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

    startDownload() {
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
}