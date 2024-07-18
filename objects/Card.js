import {Author} from './Author.js';

export class Card {
    /**
    * @param {string} author
    * @param {string} title
    * @param {string} description
    * @param {number} createDate
    * @param {Array<string>} tags
    * @param {number} views
    * @param {number} downloads
    * @param {number} screenshots
    * @param {number} revisions
    * @param {Array<string>} files
    * @param {string} pluginVersion
    * @param {string} mcVersion
    * @param {boolean} prem
    */
    constructor(author, title, description, createDate, tags, views, downloads, screenshots, revisions, files, pluginVersion, mcVersion, prem) {
        this.author = new Author(author);
        this.title = title;
        this.description = description;
        this.creation = createDate;
        this.tags = tags;
        this.views = views;
        this.downloads = downloads;
        this.screenshots = screenshots;
        this.revisions = revisions;
        this.files = files;
        this.plVer = pluginVersion;
        this.mcVer = mcVersion;
        this.prem = prem;
    }

    /**
     * @returns {Author}
     */
    getAuthor() {
        return this.author;
    }

    /**
     * @returns {string}
     */
    getTitle() {
        return this.title;
    }

    /**
     * @returns {string}
     */
    getDescription() {
        return this.description;
    }

    /**
     * @returns {number}
     */
    getCreation() {
        return this.creation;
    }

    /**
     * @returns {Array<string>}
     */
    getTags() {
        return this.tags;
    }

    /**
     * @returns {number}
     */
    getViews() {
        return this.views;
    }

    /**
     * @returns {number}
     */
    getDownloads() {
        return this.downloads;
    }

    /**
     * @returns {number}
     */
    getScreenshots() {
        return this.screenshots;
    }

    /**
     * @returns {number}
     */
    getRevisions() {
        return this.revisions;
    }

    /**
     * @returns {Array<string>}
     */
    getFiles() {
        return this.files;
    }

    /**
     * @returns {string}
     */
    getPluginVersion() {
        return this.plVer;
    }

    /**
     * @returns {string}
     */
    getMinecraftVersions() {
        return this.mcVer;
    }

    /**
     * @returns {boolean}
     */
    isPremium() {
        return this.prem;
    }
}