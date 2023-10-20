//import {SearchResults} from './SearchResults';
import {Card} from './Card.js';

export class Cards {

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
     * @return {Card}
     */
    get(id) {
        return this.cards.get(id);
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
        /*
        while (i < this.cards.size && i < 30) {
            cards.set(this.cards.get(i++));
        }
        */
        for (var [key,value] of this.cards) {
            if (i > 30) break;
            cards.set(key, value);
            i++;
        }
        return cards;
    }
}