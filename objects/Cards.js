const SearchResults = require("./SearchResults");

module.exports = class Cards {

    cards;
    
    /**
     * @param {Map<string, Card>} cards
     */
    constructor(cards) {
        this.cards = cards;
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
     * @param {number} i
     * @param {SearchResults} filter
     */
    get(i, filter) {
        var all = this.cards.size / 30;
        var p = all * i;
    }
}