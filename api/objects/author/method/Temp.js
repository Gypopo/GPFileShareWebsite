import {Credentials} from '../Credentials.js';

export class Temp {

    name;
    experation;

    /**
     * @param {string} data
    */
    constructor(data) {
        var date = new Date();
        date.setDate(date.getDate() + 30);

        this.name = !data ? "Anonymous" : data;
        this.experation = date.toJSON();
    }
}