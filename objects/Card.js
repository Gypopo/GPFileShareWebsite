import {Author} from './Author.js';

export class Card {
    /**
    * @param {string} author
    * @param {string} description
    * @param {number} createDate
    * @param {Array<string>} tags
    * @param {string} pluginVersion
    * @param {string} mcVersion
    * @param {boolean} prem
    */
    constructor(author, description, createDate, tags, pluginVersion, mcVersion, prem) {
        this.author = new Author(author);
        this.desc = description;
        this.creation = createDate;
        this.tags = tags;
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
    getDescription() {
        return this.desc;
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
     * @returns {string}
     */
    getPluginVersion() {
        return this.plVer;
    }

    /**
     * @returns {string}
     */
    getMinecraftVersion() {
        return this.mcVer;
    }

    /**
     * @returns {boolean}
     */
    isPremium() {
        return this.prem;
    }
}