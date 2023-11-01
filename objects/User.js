export class User {

    username; // Discord username
    avatar; // Discord avatar URL
    authenticated; // Whether is verified for ESGUI prem in GPPlugins discord
    userID; // Discord UUID

    /**
    * @param {string} username
    * @param {string} avatar
    * @param {boolean} authenticated
    * @param {string} userID
    */
    constructor(username, avatar, authenticated, userID) {
        this.username = username;
        this.avatar = avatar;
        this.authenticated = authenticated;
        this.userID = userID;
    }

    /**
     * 
     * @returns {string}
     */
    getUsername() {
        return this.username;
    }

    /**
     * 
     * @returns {string}
     */
    getAvatar() {
        return this.avatar;
    }

    /**
     * 
     * @returns {boolean}
     */
    isAuthenticated() {
        return this.authenticated;
    }

    /**
     * 
     * @returns {string}
     */
    getUserID() {
        return this.userID;
    }
}