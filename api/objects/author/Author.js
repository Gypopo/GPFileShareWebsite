import {Discord} from './method/Discord.js';
import {Temp} from './method/Temp.js';

export class Author {

    /**
     * @param {string} data
    */
    constructor(data) {
        var raw = data.split(":");
        if (raw[0].normalize() === "discord".normalize()) {
            this.credentials = new Discord(data[1])
        } else if (raw[0].normalize() === "temp".normalize()) {
            this.credentials = new Temp(data[1])
        }
    }
}