var xhr = require('xmlhttprequest');

setInterval(function(){ 



  console.log("Sending request at", new Date())
  var XMLHttpRequest = xhr.XMLHttpRequest;
  var request = new XMLHttpRequest();
  request.open('GET', "http://localhost:3000/quotes/save", true);

  request.onload = function()

  request.send();
}, 30000);