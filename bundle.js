(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = async function call() {
    const response = await fetch('https://node1.gpplugins.com:2083/api/guild/member/416924727224041473', {
        method: 'GET',
    });
    //const myJson = await response.json();
    const text = await response.text();

    //console.log(myJson);
    return text;
}
},{}],2:[function(require,module,exports){
//var query = require('./database/MySQL.js');
var apiCall = require('./api.js');
var cardList = document.getElementById('cards');

    //console.log(apiCall());
    apiCall().then(v => console.log(v));



function appendCard(card) {
    cardList.appendChild(card);
}

function removeCard(card) {
    cardList.removeChild(card);
}

function createCard(id) {
    var card = document.createElement('div');
    card.onclick = function() {displayCard(card);}
    card.className = 'card';
    var cards = new Card(1, 'Gypopo', "Cool looking gui layout's", '4am', '#op, #skyblock #survival #basic #cheap #modern #oldSchool french, everyItem', '5.2.4', '1.19, 1.18');
    
    return card;
}

function loadCard(uuid, author, mcVersion, plVersion, ) {
    var card = document.createElement('div');
    card.onclick = function() {displayCard(card);}
    card.className = 'card';
    
    return card;
}

function displayCard(card) {
    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'overlay';
    overlay.innerText = "test";

    var content = document.createElement('div');
    content.className = 'overlay content';
    overlay.appendChild(content);

    overlay.onclick = closeListener;

    document.body.appendChild(overlay);
}

function closeListener(e) {
    var overlay = document.getElementById('overlay');
    
    if (e.target == overlay) {
        document.body.removeChild(overlay);
    }
}

appendCard(createCard());
appendCard(createCard());
appendCard(createCard());
appendCard(createCard());
appendCard(createCard());
appendCard(createCard());
appendCard(createCard());
appendCard(createCard());
},{"./api.js":1}]},{},[2]);
