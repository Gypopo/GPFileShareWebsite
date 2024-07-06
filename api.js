import { Card } from './objects/Card.js';
import { User } from './objects/User.js';
import { Author } from './objects/Author.js';
import { SimpleFile } from './objects/SimpleFile.js';

export class API {

  /**
  * @returns {Promise<Array<Card>>}.
  */
  async loadCards() {
    var response = await this.fetchWithTimeout(this.API_URL + 'getCards', {
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

  /**
     * @param {Map<string, Card>} cards
     */
  async getCardsByAuthorID(id) {
    var response = await this.fetchWithTimeout(this.API_URL + 'getCards?byAuthorID=' + id, {
      method: 'GET',
      timeout: 15000
    });

    var raw = await response.text();
    var values = JSON.parse(raw);
    var map = new Map(Object.entries(values).map(([key, value]) => [key, this.reviver(key, value)]));

    return map;
  }

  reviver(key, value) {
    if (typeof value === 'object') {
      return new Card(value.author, value.title, value.description, value.creation, value.tags, value.views, value.downloads, value.screenshots, value.files, value.plVer, value.mcVer, value.prem);
    }
    return value;
  }

  /**
  * @param {string} layout
  * @param {string} file
  * @returns {Promise<string>}
  */
  async previewFile(layout, file) {
    var response = await this.fetchWithTimeout(this.API_URL + 'previewFile?layout=' + layout + "&file=" + file, {
      method: 'GET',
      timeout: 15000,
      headers: this.form(),
    });

    return await response.text();
  }

  /**
   * @param {string} layout
   * @param {Card} card
   */
  async updateCard(layout, card) {
    var response = await this.fetchWithTimeout(this.API_URL + 'updateCard?layout=' + layout, {
      method: 'POST',
      timeout: 15000,
      headers: this.form(),
      body: JSON.stringify(card),
    });
    this.updateData(response.headers);

    console.log(response.status + ' - ' + response.ok);

    return response.ok;
  }

  async getLayoutScreenshots(layout) {
    var response = await this.fetchWithTimeout(this.API_URL + 'getScreenshots?layout=' + layout, {
      method: 'GET',
      timeout: 15000,
      headers: this.form(),
    });

    const text = await response.text();
    return this.handleMultipartResponse(text);
  }

  handleMultipartResponse(data) {
    const boundary = "--boundary";
    const parts = data.split(boundary);
    var files = [];
  
    parts.forEach(part => {
      if (part.includes("Content-Type: image/png")) {
        console.log(part.split("\r\n\r\n")[1].trim());
        var json = JSON.parse(part.split("\r\n\r\n")[1].trim()); // Trim to remove extra new lines
        files.push(this.getFileFromJson(json));
      }
    });

    return files;
  }

  getFileFromJson(json) {
    const byteCharacters = atob(json.bytes);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: 'image/png'});
  
    var url = URL.createObjectURL(blob);
    return new SimpleFile(json.fileName, url);
  }

  /**
   * @param {string} layout
   * @param {File} screenshot
   * @param {string} type
   */
  async uploadScreenshot(layout, screenshot) {
    var headers = this.form();
    headers['Content-Type'] = screenshot.type;
    headers['fileName'] = screenshot.name;

    var response = await this.fetchWithTimeout(this.API_URL + 'appendScreenshot?layout=' + layout, {
      method: 'POST',
      timeout: 15000,
      headers: headers,
      body: screenshot,
    });

    return response.ok;
  }

  /**
   * @param {string} layout
   */
  async deleteLayout(layout) {
    var response = await this.fetchWithTimeout(this.API_URL + 'deleteLayout?layout=' + layout, {
      method: 'GET',
      timeout: 15000,
      headers: this.form(),
    });
    this.updateData(response.headers);

    return response.ok;
  }

  /**
  * @param {string} layout
  * @param {Card} card
  */
  async downloadLayout(layout, card) {
    try {

      var response = await this.fetchWithTimeout(this.API_URL + "downloadLayout?layout=" + layout, {
        method: 'GET',
        timeout: 15000,
        resolveWithFullResponse: true,
        headers: this.form(),
      });

      if (response.status === 200) {
        var blob = await response.blob();
        //var raw = await response.text();
        //var bytes = this.base64ToArrayBuffer(raw);
        var element = document.createElement('a');
        element.style.display = 'none';
        var url = window.URL.createObjectURL(blob);
        element.href = url;
        element.download = layout + ".zip";
        element.click();
        document.body.appendChild(element);
        element.remove();
        window.URL.revokeObjectURL(url);
      }

      var self = this;
      setTimeout(function () {
        self.completeDownload(response.status);
      }, 5000);
    } catch (e) {
      var self = this;
      console.log(e);
      setTimeout(function () {
        self.completeDownload(503);
      }, 5000);
    }
  }

  /**
    * @param {number} status
    */
  completeDownload(status) {
    var e = document.getElementById('confirm content-small');

    if (status == '200') {
      e.innerHTML = '<div class="wrapper"><svg class="animated-check" viewBox="0 0 24 24"><path d="M4.1 12.7L9 17.6 20.3 6.3" fill="none"></path></svg></div><b>Success</b>';
    } else if (status == '503') {
      e.innerHTML = '<p style="font-size:25px;position:absolute;margin:0;" class="wrapper">❌</p><b style="bottom:12px;right:35px;font-size:15px;margin:0;position:absolute;">Not authorized ' + status + "</b>";
    } else {
      e.innerHTML = '<p style="font-size:25px;position:absolute;margin:0;" class="wrapper">❌</p><b style="bottom:12px;right:35px;font-size:15px;margin:0;position:absolute;">Error ' + status + "</b>";
    }

    setTimeout(function () {
      document.getElementById('confirm').remove();
    }, 5000)
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

  form() {
    var headers = {};
    var identity = this.getCookie('sessionID');
    if (identity != null) {
      headers['sessionID'] = identity;
    }
    var token = this.getCookie('token');
    if (token != null) {
      headers['token'] = token;
    }
    return headers;
  }

  /**
   * 
   * @param {string} cookie 
   * @returns {string}
   */
  getCookie(cookie) {
    let name = cookie + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookies = decodedCookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let c = cookies[i];
      //console.log(c);
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  /**
   * 
   * @param {string} cookie 
   * @returns {string}
   */
  getCookieExpire(cookie) {
    let name = cookie + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    console.log(document.cookie);
    let cookies = decodedCookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let c = cookies[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0 && cookies.length >= i + 1) {
        var meta = cookies[i + 1];
        return meta.substring(name.length + 1, meta.length);
      }
    }
    return null;
  }

  setCookie(cookie, value, remember) {
    if (remember === 'true') {
      var d = new Date();
      d.setTime(d.getTime() + 1209600000);
      this.setOldCookie(cookie, value, d.toUTCString());
    } else {
      document.cookie = cookie + "=" + value + ";";
    }
  }

  setOldCookie(cookie, value, remember, expire) {
    if (remember) {
      var expires = "expires=" + expire;
      document.cookie = cookie + "=" + value + ";" + expires + ";path=/";
    } else {
      document.cookie = cookie + "=" + value + ";";
    }
  }

  setRawCookie(cookie, value, expire) {
    var d = new Date();
    d.setTime(expire);
    this.setOldCookie(cookie, value, expire != 0, d.toUTCString());
  }

  setExistingCookie(cookie, value) {
    document.cookie = cookie + "=" + value + ";";
    console.log(cookie + "=" + value + ";");
  }

  base64ToBytes(base64) {
    var binString = atob(base64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0));
  }

  bytesToBase64(bytes) {
    var binString = String.fromCodePoint(...bytes);
    return btoa(binString);
  }

  removeUserData() {
    var expire = 'Thu, 01 Jan 1970 00:00:00 GMT';
    this.setOldCookie('data', '', expire);
    this.setOldCookie('sessionID', '', expire)
    this.setOldCookie('token', '', expire);
  }

  updateData(headers) {
    if (headers.has('sessionID') && headers.has('token') && headers.has('expire')) {
      this.setRawCookie('sessionID', headers.get('sessionID'), headers.get('expire'));
      this.setRawCookie('token', headers.get('token'), headers.get('expire'));
    }
  }

  /**
   * 
   * @returns {Promise<User>}
   */
  async getUserData() {
    try {
      var cached = this.getCookie('data');
      if (cached != null && cached != '') {
        var obj = JSON.parse(atob(cached));
        return new User(obj.username, obj.avatar, obj.authenticated, obj.userID);
      } else {
        var sessionID = this.getCookie('sessionID');
        var token = this.getCookie('token');
        if ((sessionID != null && sessionID != '') && (token != null && token != '')) {
          // New session || Refresh user data
          var user = await this.getKnownUserData(sessionID, token);
          return user;
        } else return null;
      }
    } catch (e) {
      console.warn(e + this.getCookie('data'));
      this.setOldCookie('data', '', 'Thu, 01 Jan 1970 00:00:00 GMT');
      return null;
    }
  }

  async getKnownUserData(sessionID, token) {
    try {
      var response = await this.fetchWithTimeout(this.API_URL + "getUserData?sessionID=" + sessionID + "&token=" + token, {
        method: 'GET',
        timeout: 15000,
        resolveWithFullResponse: true,
        headers: this.form(),
      });

      if (response.status === 200) {
        var headers = response.headers;
        this.updateData(headers);

        // Still logged in using cookies/Remember me option
        var raw = await response.text();

        // Store the userdata in a cookie as text, to later retrieve as a User object
        this.setCookie('data', raw, false);

        var obj = JSON.parse(atob(raw));
        return new User(obj.username, obj.avatar, obj.authenticated, obj.userID);
      }

      return null;
    } catch (e) {
      console.warn(e);
      return null;
    }
  }

  /**
   * 
   * @returns {Promise<User>}
   */
  async retrieveUserData(token, remember) {
    try {
      var response = await this.fetchWithTimeout(this.API_URL + "retrieveUserData?token=" + token, {
        method: 'GET',
        timeout: 15000,
        resolveWithFullResponse: true,
      });

      if (response.status === 200) {
        var headers = response.headers;

        //console.log(...headers);
        if (headers.has('sessionID') && headers.has('token')) {
          this.setCookie('sessionID', headers.get('sessionID'), remember);
          this.setCookie('token', headers.get('token'), remember);
        } else {
          console.warn('No sessionID/token received from server');
          alert('Failed to login at this time, please try again soon.');
        }

        // Still logged in using cookies/Remember me option
        var raw = await response.text();

        // Store the userdata in a cookie as text, to later retrieve as a User object
        this.setCookie('data', raw, false);

        console.log(atob(raw));

        var obj = JSON.parse(atob(raw));
        return new User(obj.username, obj.avatar, obj.authenticated, obj.userID);
      }

      return null;
    } catch (e) {
      console.warn(e);
      return null;
    }
  }

  API_URL = 'http://127.0.0.1:8085/val/'/*'https://api.gpplugins.com:2096/val/'*/;
}