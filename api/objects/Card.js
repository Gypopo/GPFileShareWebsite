import {Tags} from './Tags.js';

export class Card {
    /**
    * @param {string} author
    */
    constructor(author, description, createDate, tags, pluginVersion, mcVersion) {
        this.author = author;
        this.desc = description;
        this.creation = createDate;
        this.tags = new Tags(tags).tags;
        this.plVer = pluginVersion;
        this.mcVer = mcVersion;
    }
}