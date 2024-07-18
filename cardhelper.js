import { Card } from './objects/Card.js';
import { Cards } from './objects/Cards.js';
import { Author } from './objects/Author.js';

export class CardHelper {

    constructor(api, cards) {
        this.api = api;
        this.cards = cards;
    }

    /**
     * @param {string} id
     * @param {Card} card 
     */
    createCard(id, card) {
        var div = document.createElement('div');
        div.onclick = () => {
            history.pushState(null, null, window.location.href + "?layout=" + id);
            this.displayCard(id, card);
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
        downloadCount.innerHTML = '<img src="pics/download.svg" height=20></img> ' + this.getFormatted(card.getDownloads());
        container.appendChild(downloadCount);

        div.appendChild(container);
    }

    getFormatted(downloads) {
        if (downloads == 0)
            return downloads;
        // Define the suffixes for thousands, millions, billions, etc.
        const suffixes = ["", "k", "M", "B", "T"];
        // Determine the order of magnitude of the number
        const order = Math.floor(Math.log10(Math.abs(downloads)) / 3);
        // Determine the suffix based on the order of magnitude
        const suffix = suffixes[order] || '';
        // Calculate the short number by dividing the original number by 1000^order
        const shortNumber = downloads / Math.pow(10, order * 3);
        // Format the short number to one decimal place and add the suffix
        return shortNumber % 1 === 0
            ? shortNumber + suffix
            : shortNumber.toFixed(1) + suffix;
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

        // Shop count
        var shopCount = document.createElement('div');
        shopCount.className = 'overlay-shopCount';
        shopCount.innerHTML = '<b>Shop count: </b>' + card.getFiles().length;
        box.appendChild(shopCount);

        // Update count
        if (card.getRevisions() > 0) {
            var revisionCount = document.createElement('div');
            revisionCount.className = 'overlay-updateCount';
            revisionCount.innerHTML = '<b>Updates: </b>' + card.getRevisions() + '<img src="pics/pop-out.svg" height="24" title="Click to get more info"></img>';
            revisionCount.addEventListener("click", () => {
                var link = window.location.href + '&showRevisions=true';
                history.pushState(null, null, link);

                this.showRevisions(id);
            });
            box.appendChild(revisionCount);
        }

        // SS count
        if (card.getScreenshots() > 0) {
            var screenshotCount = document.createElement('div');
            screenshotCount.className = 'overlay-screenshotCount';
            screenshotCount.innerHTML = '<b>Screenshots: </b>' + card.getScreenshots() + '<img src="pics/pop-out.svg" height="24" title="Click to view"></img>';
            screenshotCount.addEventListener("click", () => {
                this.displayImageGalary(files, 0);
            });
            box.appendChild(screenshotCount);
        }

        // SS Preview
        var ssPreview = document.createElement('div');
        ssPreview.className = 'overlay-ssPreview';
        ssPreview.id = 'ss-preview';
        box.appendChild(ssPreview);

        // Layout files
        var filesBox = document.createElement('div');
        filesBox.className = 'overlay-filesBox';
        filesBox.innerHTML = '<b>Click any file to preview:</b>';

        // Files
        var files = document.createElement('div');
        files.className = 'overlay-files';
        files.innerHTML = this.getFiles(card);
        filesBox.append(files);
        box.appendChild(filesBox);

        var buttonRow = this.createButtonRow(id);
        box.appendChild(buttonRow);

        content.appendChild(box);

        overlay.appendChild(content);
        overlay.onclick = this.closeListener;

        document.body.appendChild(overlay);

        this.setView(content);

        this.addFilePreviews(id, card);

        if (card.getScreenshots() > 0)
            this.displaySSPreview(id);
    }

    async displaySSPreview(id) {
        var files = await this.api.getLayoutScreenshots(id);
        for (var file of files) {
            const img = document.createElement('img');
            img.src = file.url;
            img.height = 100;
            img.addEventListener("click", () => {
                this.displayImageGalary(files, 0);
            });
            document.getElementById('ss-preview').appendChild(img);
        }
    }

    /**
     * 
     * @param {Array<SimpleFile>} files 
     */
    displayImageGalary(files, index) {
        var galary = document.createElement('div');
        galary.className = 'overlay-galary';
        galary.id = 'overlay-galary';
        galary.onclick = this.galaryCloseListener;

        var ssGalary = document.createElement('div');
        ssGalary.className = 'overlay-ssGalary';
        ssGalary.id = 'ssGalary';

        var imgSize = Math.min((window.innerHeight / 1.5) / 100, (window.innerWidth / 1.5) / 100);
        var space = Math.max(5, Math.min(40, imgSize * 5));
        console.log(imgSize * 90);

        if (files.length > 1) {
            var prevIndex = index - 1;
            if (prevIndex < 0)
                prevIndex = files.length - 1;

            // Display previous screenshot as thumbnail
            var thumbnailBoxPrev = document.createElement('div');
            thumbnailBoxPrev.addEventListener("click", () => {
                var galary = document.getElementById("overlay-galary");
                if (galary != null)
                    galary.remove();
                this.displayImageGalary(files, prevIndex);
            });
            thumbnailBoxPrev.className = 'overlay-ssTumbnail';
            thumbnailBoxPrev.style.height = imgSize * 25 + 'px';
            thumbnailBoxPrev.style.width = imgSize * 25 + 'px';
            thumbnailBoxPrev.style.marginRight = space + 'px';
            console.log(((imgSize * 65) - (imgSize * 25)) / 2 + 'px');
            thumbnailBoxPrev.style.position = 'relative';
            thumbnailBoxPrev.style.display = 'inline-block';
            thumbnailBoxPrev.style.cursor = "pointer";

            var thumbnailPrev = document.createElement('img');
            thumbnailPrev.style.top = '50%';
            thumbnailPrev.style.transform = 'translateY(-50%)';
            thumbnailPrev.src = files.at(prevIndex).url;
            thumbnailPrev.style.width = '100%';
            thumbnailPrev.alt = 'ss' + prevIndex;
            thumbnailPrev.style.position = 'relative';
            thumbnailBoxPrev.appendChild(thumbnailPrev);
            ssGalary.appendChild(thumbnailBoxPrev);
        }

        var mainIMGBox = document.createElement('div');
        mainIMGBox.style.height = imgSize * 90 + 'px';
        mainIMGBox.style.width = imgSize * 90 + 'px';
        //mainIMGBox.style.top = '50%';
        //mainIMGBox.style.left = '50%';
        //mainIMGBox.style.transform = 'translate(-50%, -50%)';
        mainIMGBox.style.position = 'relative';
        mainIMGBox.style.display = 'inline-block';

        var mainIMG = document.createElement('img');
        mainIMG.id = 'mainIMG';
        mainIMG.src = files.at(index).url;
        mainIMG.alt = 'ss' + index;
        mainIMG.style.top = '50%';
        mainIMG.style.transform = 'translateY(-50%)';
        mainIMG.style.position = 'relative';
        mainIMG.style.width = '100%';
        mainIMGBox.appendChild(mainIMG);
        ssGalary.appendChild(mainIMGBox);

        var thumbnails = document.createElement('div');
        thumbnails.className = 'overlay-ssTumbnails';

        if (files.length > 1) { // If there are more screenshots
            var nextIndex = index + 1;
            if (nextIndex == files.length)
                nextIndex = 0;

            // Display next screenshot as thumbnail
            var thumbnailBoxNext = document.createElement('div');
            thumbnailBoxNext.addEventListener("click", () => {
                var galary = document.getElementById("overlay-galary");
                if (galary != null)
                    galary.remove();
                this.displayImageGalary(files, nextIndex);
            });
            thumbnailBoxNext.className = 'overlay-ssTumbnail';
            thumbnailBoxNext.style.height = imgSize * 25 + 'px';
            thumbnailBoxNext.style.width = imgSize * 25 + 'px';
            thumbnailBoxNext.style.marginLeft = space + 'px';
            thumbnailBoxNext.style.position = 'relative';
            thumbnailBoxNext.style.display = 'inline-block';
            thumbnailBoxNext.style.cursor = "pointer";

            var thumbnailNext = document.createElement('img');
            thumbnailNext.style.top = '50%';
            thumbnailNext.style.transform = 'translateY(-50%)';
            thumbnailNext.src = files.at(nextIndex).url;
            thumbnailNext.style.width = '100%';
            thumbnailNext.alt = 'ss' + nextIndex;
            thumbnailNext.style.position = 'relative';
            thumbnailBoxNext.appendChild(thumbnailNext);
            ssGalary.appendChild(thumbnailBoxNext);
        }

        galary.appendChild(ssGalary);
        document.body.appendChild(galary);
        this.setView(ssGalary);
    }

    /**
     * @param {string} layout
     */
    async showRevisions(layout) {
        await this.api.getRevisionInfo(layout).then(v => {
            var overlay = document.getElementById('overlay');
            if (overlay != null)
                overlay.remove();

            this.displayRevisionInfo(layout, v);
        });
    }

    /**
     * @param {string} layout 
     * @param {string} payload
     * @param {string} file 
     */
    displayRevisionInfo(layout, revisions) {
        var overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.id = 'overlay';

        var content = document.createElement('div');
        content.className = 'overlay-content';

        var title = document.createElement('div');
        title.innerHTML = 'Update info:';
        title.className = 'overlay-title';
        content.appendChild(title);

        var box = document.createElement('div');
        box.className = 'overlay-box';

        // GUIDE
        var revisionGuide = document.createElement('div');
        revisionGuide.className = 'revisionTable';
        revisionGuide.style.backgroundColor = 'rgb(167 167 167)';
        revisionGuide.innerHTML = '<div class="revisionItem">Version:</div><div class="revisionItem">Release date:</div><div class="revisionItem">Update message:</div>'
        revisionGuide.style.marginBottom = '10px';
        box.appendChild(revisionGuide);

        for (let i = revisions.length -1; i >= 0; i--) {
            var revision = revisions[i];

            var seperator = document.createElement('hr');
            seperator.style.margin = '0';
            box.appendChild(seperator);

            var container = document.createElement('div');
            container.className = 'revisionTable';
            container.style.marginTop = '5px';

            // Version
            var revisionVer = document.createElement('div');
            revisionVer.className = 'revisionItem';
            revisionVer.innerText = 'v' + revision.version;

            // Release date
            var d = new Date();
            d.setTime(revision.date);
            const dateFormat = {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              };

            var revisionDate = document.createElement('div');
            revisionDate.className = 'revisionItem';
            revisionDate.innerText = d.toLocaleDateString('en-US', dateFormat);

            // Changelog
            var revisionMSG = document.createElement('div');
            revisionMSG.className = 'revisionItem';
            revisionMSG.style.fontStyle = 'oblique';
            revisionMSG.innerText = revision.msg;

            container.appendChild(revisionVer);
            container.appendChild(revisionDate);
            container.appendChild(revisionMSG);

            box.appendChild(container);
        }

        var buttonRow = this.createRevisionButtonRow(layout);
        box.appendChild(buttonRow);

        content.appendChild(box);

        overlay.appendChild(content);
        overlay.onclick = this.closeListener;

        document.body.appendChild(overlay);

        this.setView(content);
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
            html += '<a style="cursor: pointer;color:#0040AE;" id="previewFile=' + files.at(i) + '"><b>' + files.at(i) + '</b></a>';
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
            file.addEventListener("click", () => {
                this.fastPreview(layout, files.at(i));
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

        await this.api.previewFile(layout, file).then(v => {
            var overlay = document.getElementById('overlay');
            overlay.remove();

            this.previewFile(layout, file, v);
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

        var buttonRow = this.createPreviewButtonRow(layout);
        box.appendChild(buttonRow);

        content.appendChild(box);

        overlay.appendChild(content);
        overlay.onclick = this.closeListener;

        document.body.appendChild(overlay);

        this.setView(content);

        Prism.highlightAll();
    }

    /**
     * @param {string} layout
     * @returns {HTMLDivElement}
     */
    createRevisionButtonRow(layout) {
        // Button row
        var buttonRow = document.createElement('div');
        buttonRow.className = 'overlay-buttonRow-bottom';

        var bottom = document.createElement('div');
        bottom.className = 'bottom';

        var button2 = document.createElement('button');
        button2.className = 'update-button';
        button2.innerHTML = '<- Back';
        button2.onclick = () => {
            var link = window.location.href.split('?')[0] + '?layout=' + layout;
            history.pushState(null, null, link);

            var overlay = document.getElementById('overlay');
            overlay.remove();

            this.displayCard(layout, this.cards.get(layout));
        }

        bottom.appendChild(button2);
        buttonRow.appendChild(bottom);

        return buttonRow;
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
            // Todo
        }
        buttonRow.appendChild(button1);

        var button2 = document.createElement('button');
        button2.className = 'preview-button';
        button2.innerHTML = '<- Back';
        button2.onclick = () => {
            var link = window.location.href.split('?')[0] + '?layout=' + layout;
            history.pushState(null, null, link);

            var overlay = document.getElementById('overlay');
            overlay.remove();

            this.displayCard(layout, this.cards.get(layout));
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
        button1.onclick = () => {
            this.createDownloadDisclaimer();

            var confirm = document.getElementById('disclaimer-confimButton');
            confirm.onclick = () => {
                var overlay = document.getElementById('disclaimer-overlay');
                overlay.remove();

                var card = this.cards.get(layout);
                this.api.getUserData().then(user => {
                    if (!card.isPremium() || user) {
                        this.startDownload();
                        this.api.downloadLayout(layout, card).catch();
                    } else
                        alert('You are not authorized to download this layout.');
                });
            }
        }
        buttonRow.appendChild(button1);

        var button3 = document.createElement('button');
        button3.className = 'card-button';
        button3.style.width = '40%';
        button3.style.marginRight = '5%';
        button3.innerHTML = 'Get install command';
        button3.onclick = () => {
            this.createDownloadDisclaimer();

            var confirm = document.getElementById('disclaimer-confimButton');
            confirm.onclick = () => {
                var overlay = document.getElementById('disclaimer-overlay');
                overlay.remove();

                this.createInstallCommandOverlay(layout);
            }
        }
        buttonRow.appendChild(button3);

        var button2 = document.createElement('button');
        button2.className = 'card-button';
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

    createDownloadDisclaimer() {
        var overlay = document.createElement('div');
        overlay.className = 'disclaimer-overlay';
        overlay.id = 'disclaimer-overlay';
        overlay.onclick = function (e) {
            if (e.target == overlay) {
                document.body.removeChild(overlay);
                history.pushState(null, null, "/");
            }
        }

        var content = document.createElement('div');
        content.className = 'disclaimer-content';

        var title = document.createElement('div');
        title.innerHTML = 'Disclaimer:';
        title.className = 'disclaimer-title';
        content.appendChild(title);

        var box = document.createElement('div');
        box.className = 'disclaimer-box';
        content.appendChild(box);

        var disclaimerDescription = document.createElement('span');
        disclaimerDescription.innerHTML = 'All layouts on this site are created/uploaded by comminity members<br>and may not be validated by our staff.<br><br>\
    Altough all layouts get scanned for malicious content upon uploading it to this site,<br>it is recommended to validate the installed layout manually for exploitable/unfair prices before using it on your server.';
        box.appendChild(disclaimerDescription);

        var button1 = document.createElement('div');
        button1.className = 'disclaimer-confimButton';
        button1.id = 'disclaimer-confimButton';
        button1.innerHTML = 'I agree';
        box.appendChild(button1);

        overlay.appendChild(content);

        document.body.appendChild(overlay);

        this.setView(content);
    }

    createInstallCommandOverlay(id) {
        var overlay = document.createElement('div');
        overlay.className = 'installCommand-overlay';
        overlay.id = 'installCommand-overlay';
        overlay.onclick = function (e) {
            if (e.target == overlay) {
                document.body.removeChild(overlay);
                history.pushState(null, null, "/");
            }
        }

        var content = document.createElement('div');
        content.className = 'installCommand-content';

        var title = document.createElement('div');
        title.innerHTML = 'Install command:';
        title.className = 'installCommand-title';
        content.appendChild(title);

        var box = document.createElement('div');
        box.className = 'installCommand-box';
        content.appendChild(box);

        var disclaimerDescription = document.createElement('span');
        disclaimerDescription.style.textAlign = 'center';
        disclaimerDescription.innerHTML = 'Use the following command on your server to install this layout';
        box.appendChild(disclaimerDescription);

        var cmd = '/eshop installLayout ' + id;
        var command = document.createElement('div');
        command.className = 'installCommand-command';
        command.title = 'Click to copy';
        command.innerHTML = '<b>' + cmd + '</b>';
        command.onclick = function () {
            navigator.clipboard.writeText(cmd).then(
                function () {
                    alert("Successfully copied command to clipboard");
                }).catch(function () { alert("Failed to copy command to clipboard"); });
        }
        box.appendChild(command);

        overlay.appendChild(content);

        document.body.appendChild(overlay);

        this.setView(content);
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

        var scrollPosition = window.scrollY || document.documentElement.scrollTop;
        content.style.top = scrollPosition + 'px';
    }

    galaryCloseListener(e) {
        var overlay = document.getElementById('overlay-galary');

        if (e.target == overlay)
            document.body.removeChild(overlay);
    }

    closeListener(e) {
        var overlay = document.getElementById('overlay');

        if (e.target == overlay) {
            document.body.removeChild(overlay);
            history.pushState(null, null, "/");
        }
    }

    // Displays the div at the current scrollheight so the user can see it
    setView(div) {
        var scrollPosition = window.scrollY || document.documentElement.scrollTop;
        var pos = (window.innerHeight - div.offsetHeight) / 2 + scrollPosition;
        div.style.top = pos + 'px';
    }
}