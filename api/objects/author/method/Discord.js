import {Credentials} from '../Credentials.js';

export class Discord extends Credentials {
    
    /**
     * @param {string} uuid
    */
    constructor(uuid) {
        this.uuid = uuid;
    }
}