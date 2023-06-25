export class Author {

    type;
    name;
    id;

    /**
    * @param {string} data
    */
    constructor(data) {
        this.type = data.type;
        this.name = data.name;
        this.id = data.id;
    }

    /**
     * @returns {string} name
    */
    getAuthor() {
        return this.name;
    }

    /**
     * @returns {string} type
    */
    getMethod() {
        return this.type;
    }

     /**
     * @returns {string} data
    */
    getData() {
        return this.id;
    }

    /**
     * @returns {boolean} Whether this is a discord author
    */
    isDiscord() {
        return this.type === 'DISCORD';
    }

    /**
     * @returns {boolean} Whether this is a temp author
    */
    isTemp() {
        return this.type === 'TEMP';
    }

}