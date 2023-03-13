const SearchResults = require("./SearchResults");

module.exports = class Cards {

    pageSize;
    cards;

    /**
     * @param {Map<string, Card>} cards
     */
    init(cards) {
        this.cards = cards;
        this.pageSize = 5;
    }

    /**
     * @return {Map<string, Card>}
     */
    get() {
        return this.cards;
    }

    /**
     * @param {string} id
     * @param {Card} card
     */
    add(id, card) {
        this.cards.set(id, card);
    }

    /**
     * @param {number} p
     * @param {SearchResults} filter
     * @return {Map<string, Card>}
     */
    getPage(p, filter) {
        var cards = new Map();
        var i = p*this.pageSize-this.pageSize;
        while (e < cards.size && e < 30) {
            var card = cards.get(e);
        }
    }
}