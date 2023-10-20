import { Card } from './objects/Card.js';
import { Author } from './objects/Author.js';

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
      return new Card(value.author, value.description, value.creation, value.tags, value.views, value.downloads, value.files, value.plVer, value.mcVer, value.prem);
    }
    return value;
  }

  /**
  * @param {string} layout
  * @param {string} file
  * @returns {Promise<string>}
  */
  async previewFile(layout, file) {
    var response = await this.fetchWithTimeout('http://192.168.55.170:3333/api/previewFile?layout=' + layout + "&file=" + file, {
      method: 'GET',
      timeout: 15000
    });

    return await response.text();
  }

/**
* @param {string} layout
* @param {Card} card
*/
async downloadLayout(layout, card) {
    try {

    var response = await this.fetchWithTimeout("http://192.168.55.170:3333/api/downloadLayout?layout=" + layout, {
          method: 'GET',
          timeout: 15000,
          resolveWithFullResponse: true,
          headers: form()
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
        setTimeout(function() {
          self.completeDownload(response.status);
        }, 5000);
      } catch (e) {
        var self = this;
        console.log(e);
        setTimeout(function() {
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
}

function form() {
  var obj = {};
  var identity = getCookie('identity');
  if (identity != null)
    obj['identity'] = identity;
  var token = getCookie('token');
  if (token != null)
    obj['token'] = token;
  return obj;
}

/**
 * 
 * @param {string} cookie 
 * @returns {string}
 */
function getCookie(cookie) {
  let name = cookie + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookies = decodedCookie.split(';');
  for(let i = 0; i <cookies.length; i++) {
    let c = cookies[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

async function login() {
  var response = await this.fetchWithTimeout("http://192.168.55.170:3333/api/downloadLayout?layout=" + layout, {
          method: 'GET',
          timeout: 15000,
          resolveWithFullResponse: true,
          headers: form()
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
        setTimeout(function() {
          self.completeDownload(response.status);
        }, 5000);
      } catch (e) {
        var self = this;
        console.log(e);
        setTimeout(function() {
          self.completeDownload(503);
        }, 5000);
      }
}