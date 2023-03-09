// Cashed search result
module.exports = class SearchResults {
    constructor() {
        this.byTag = new Map();
        this.byAuthor = new Map();
    }

    /**
     * @param {Array<string>} tags
     */
    getByTag(tags) {
        if (this.byTag.has(tags)) {
            
        }
    }

    /**
     * @param {Array<string>} tags
     * @param {Map<string, Card>} cards
     */
    byTag(tags, cards) {
        this.byTag.set(tags, cards);
    }
}