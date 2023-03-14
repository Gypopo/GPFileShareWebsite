import {MySQL} from './database/MySQL.js'
import {Storage} from './Storage.js';
import {Card} from './objects/Card.js';
import http, { IncomingMessage } from 'http';

//var db = new MySQL();
var storage = new Storage();
var server = http.createServer((request, response) => {
    //response.writeHead(200, {'Content-Type': 'application/json'});
    //response.writeHead(200, {'Access-Control-Allow-Origin': 'http://127.0.0.1:5500'});

    switch (request.url) {
        case '/api/getFiles':
            response.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://127.0.0.1:5500',
                'Content-Type': 'application/json'
            });
            var s = storage.getRaw();

            response.write(s);
            break;
        case '/api/addFile':
            storage.append();
            break;
        case '/api/createCard':
            createCard(request, response);
            break;
        default:
            response.write(request.url);
            break;
    }

    response.end();
}).listen(3333);

/**
 * Creates a new card
 *
 * @param {http.IncomingMessage} request
 * @param {http.ServerResponse} response
 * @returns {Card} item found.
 */
function createCard(request, response) {
    var headers = Object.entries(request.headersDistinct);
    console.log(headers);

    /*
    var card = new Card(
        uuidv4(),
        headers.
    )
    */
}

function call(request, response) {
    response.writeHead(200, {'Content-Type': 'application/json'});

    switch (request.url) {
        case '/api/getFiles':
            var result = db.query('show databases;');
            console.log(result);
            response.write();
            break;
        case '/api/addFile':
            storage.append();
            break;
            case '/api/addFile':
            storage.append();
            break;
        default:
            response.write(request.url);
            break;
    }

    response.end();
}