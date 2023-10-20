import {Card} from './objects/Card.js';
import {Author} from './objects/Author.js';

document.addEventListener("DOMContentLoaded", function(event) {
    var contentDiv = document.getElementById("content");
  
    var urlParams = new URLSearchParams(window.location.search);
    var paramValue = urlParams.get("id");
  
    contentDiv.innerHTML = paramValue;
  });