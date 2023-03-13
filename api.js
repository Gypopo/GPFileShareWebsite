var Card = require('./objects/Card.js');

module.exports = class API {

    /**
    * @returns {Promise<Map<string, Card>>}.
    */
    async loadCards() {
        var response = await this.fetchWithTimeout('http://192.168.55.170:3333/api/getFiles', {
            method: 'GET',
            timeout: 15000
          });

        var raw = await response.text();
        var values = new Map(JSON.parse(raw));

        var cards = [];
        for (var [key, value] of new Map(JSON.parse(raw))) {
            cards.set(key, new Card(JSON.parse(JSON.stringify(value))));
        }
        console.log(cards);

        return cards;
    }

    /**
    * @returns {Promise<Response>}
    */
    async fetchWithTimeout(resource, options = {}) {
        var { timeout = 8000 } = options;
        
        var controller = new AbortController();
        var id = setTimeout(() => controller.abort(), timeout);
        var response = await fetch(resource, {
          ...options,
          signal: controller.signal  
        });
        clearTimeout(id);

        return response;
      }

}