import { Credentials } from './Credentials.js';
import {Discord} from './method/Discord.js';
import {Temp} from './method/Temp.js';

export class Author {

    type;
    credentials;

    /**
     * @param {string} data
    */
    constructor(data) {
        var raw = data.split(":");
        this.type = raw[0];
        
        if (this.type.normalize() === "discord".normalize()) {
            this.credentials = new Discord(raw[1])
        } else if (this.type.normalize() === "temp".normalize()) {
            this.credentials = new Temp(raw[1])
        }
    }

    /**
     * @returns {string} name
    */
    getAuthor() {
        return this.credentials.name;
    }

    /**
     * @returns {string} method
    */
    getMethod() {
        return this.credentials.constructor.name;
    }

     /**
     * @returns {string} data
    */
     getData() {
        if (this.isDiscord()) {
            return this.credentials.uuid;
        } else if (this.isTemp()) {
            return this.credentials.experation;
        }
    }

    /**
     * @returns {boolean} Whether this is a discord author
    */
    isDiscord() {
        return this.credentials instanceof Discord;
    }

    /**
     * @returns {boolean} Whether this is a temp author
    */
    isTemp() {
        return this.credentials instanceof Temp;
    }

}