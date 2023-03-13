module.exports = class Card {
    constructor(id, author, description, createDate, tags, pluginVersion, mcVersion) {
        this.id = id;
        this.author = author;
        this.desc = description;
        this.creation = createDate;
        this.tags = new Array(tags);
        this.plVer = pluginVersion;
        this.mcVer = mcVersion;
    }
}