import fs from 'fs';
import { resolve } from 'path';
import {Card} from './objects/Card.js';
import {v4 as uuidv4} from 'uuid';

export class Storage {
    constructor() {
        this.map = new Map(JSON.parse(this.getRaw()));
    }

    append() {
            var card = new Card(
                'Gypopo',
                'A default shop layout',
                Date.now(),
                '#skyblock #survival, modern',
                '5.2.4',
                '1.19');

            this.map.set(uuidv4(), card);

        this.write();
    }

    write() {
        var stream = fs.createWriteStream("cards.json");

        stream.write(JSON.stringify(Array.from(this.map.entries()), null, 2));
        stream.close();

        /*
        fs.writeFile ("cards.json", JSON.stringify(this.map), function(err) {
            if (err) throw err;
            console.log('complete');
        });
        */
    }

    /**
    * @returns {Map<string, Card>}
    */
    getRaw() {
        return fs.readFileSync('cards.json', 'utf8');
    }

    /**
    * @returns {string}
    */
    getShortIndentifier() {
        var uuid = Math.random().toString(36).slice(-6);

        console.log(uuid);
    }
}