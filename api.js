import {Card} from './objects/Card.js';
import {Author} from './objects/Author.js';

export class API {

    /**
    * @returns {Promise<Array<Card>>}.
    */
    async loadCards() {
        var response = await this.fetchWithTimeout('http://192.168.55.170:3333/api/getCards', {
            method: 'GET',
            timeout: 15000
          });

        var raw = await response.text();
        var values = JSON.parse(raw);
        var map = new Map(Object.entries(values).map(([key, value]) => [key, this.reviver(key, value)]));
        
        /*
        for (var [key,value] of map) {
          console.log(key); // UUID key
          console.log(value instanceof Card); // true
          console.log(value.author); // Author name
          console.log(value.desc); // Description
          console.log(value.creation); // Creation date
          console.log(value.tags); // Array of tags
          console.log(value.plVer); // PL version
          console.log(value.mcVer); // MC version
        }
        */

        /*
        var cards = [];
        for (var value of values) {
            cards.push(new Card(JSON.parse(JSON.stringify(value))));
        }
        console.log(cards);
        */

        //return cards;
        return map;
    }

    reviver(key, value) {
      if (typeof value === 'object') {
        return new Card(value.author, value.desc, value.creation, value.tags, value.plVer, value.mcVer, value.prem);
      }
      return value;
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