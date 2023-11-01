import { API } from './api.js';
import { User } from './objects/User.js';
import { NavBar } from './navbar.js';

var api = new API();
var navBar = new NavBar(api);

listen();

function listen() {
    var button = document.getElementById('login-button');

    button.onclick = function () {
        api.getUserData().then(user => {
            if (user === null) {
                var rememberMe = document.getElementById('remember-me').getAttribute('data-selection');
                var random = crypto.getRandomValues(new Uint16Array(8)).join('');
    
                api.setCookie('remember', rememberMe, false);
                login(random, rememberMe);
            } else {
                console.warn('Already logged in as ' + user.getUsername());
                openAccount();
            }
        });
    }

    var rememberMe = document.getElementById('remember-me');

    rememberMe.onclick = function() {
        var value = rememberMe.getAttribute('data-selection');

        rememberMe.setAttribute('data-selection', value === 'true' ? 'false' : 'true');
    }
}

function login(token, remember) {
    api.setCookie('token', token, false);
    var url = "http://192.168.55.170:3333/api/authorize?login=true&remember=" + remember + "&token=" + token;
    var element = document.createElement('a');
    element.style.display = 'none';
    element.href = url;
    element.click();
    element.remove();
}

function openAccount() {
    var url = "http://127.0.0.1:5500/account.html";

    var element = document.createElement('a');
    element.style.display = 'none';
    element.href = url;
    element.click();
    element.remove();
}