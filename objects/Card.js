module.exports = class Card {
    constructor(author, description, createDate, tags, pluginVersion, mcVersion) {
        this.author = author;
        this.desc = description;
        this.creation = createDate;
        this.tags = new Array(tags);
        this.plVer = pluginVersion;
        this.mcVer = mcVersion;
    }
}