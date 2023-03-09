var Card = require('./objects/Card.js');

module.exports = class API {

    /**
    * @returns {Promise<Map<string, Card>>}.
    */
    async loadCards() {
        const response = await fetch('http://192.168.55.170:3333/api/getFiles', {
            method: 'GET',
        });

        var raw = await response.text();
        var values = new Map(JSON.parse(raw));

        var cards = new Map();
        for (var [key, value] of new Map(JSON.parse(raw))) {
            cards.set(key, new Card(JSON.parse(JSON.stringify(value))));
        }
        console.log(cards);

        return cards;
    }

}