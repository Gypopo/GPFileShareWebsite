import {Credentials} from '../Credentials.js';

export class Discord {

    name;
    uuid;
    
    /**
     * @param {string} data
    */
    constructor(data) {
        var raw = data.split(",");

        this.name = raw[0];
        this.uuid = raw[1];
    }
}