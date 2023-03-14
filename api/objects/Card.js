import {Tags} from './Tags.js';

export class Card {
    /**
     * @param {string} id
    * @param {string} author
    * @param {string} description
    * @param {number} createDate
    * @param {Array<string>} tags
    * @param {string} author
    */
    constructor(id, author, description, createDate, tags, pluginVersion, mcVersion) {
        this.id = id;
        this.author = author;
        this.desc = description;
        this.creation = createDate;
        this.tags = new Tags(tags).tags;
        this.plVer = pluginVersion;
        this.mcVer = mcVersion;
    }
}