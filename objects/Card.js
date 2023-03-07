import {Tags} from './Tags.js';

export class Card {
    constructor(id, author, description, createDate, tags, pluginVersion, mcVersion) {
        this.id = id;
        this.author = author;
        this.description = description;
        this.createDate = createDate;
        this.tags = new Tags(tags);
        this.pluginVersion = pluginVersion;
        this.mcVersion = mcVersion;
    }
}