var xhr = require('xmlhttprequest');
var mongoose = require('mongoose');
var moment = require('moment');
var tz = require('moment-timezone');
var range = require('moment-range');


setInterval(function(){ 

  var currentTime = moment().tz('America/New_York');
  var openTime = moment().tz('America/New_York').hours(9).minutes(30).seconds(0);
  var closeTime = moment().tz('America/New_York').hours(16).minutes(0).seconds(0);
  var tradingHours = moment.range(openTime, closeTime)

  if (currentTime.within(tradingHours)){
    console.log("Sending request at", new Date())
    var XMLHttpRequest = xhr.XMLHttpRequest;
    var request = new XMLHttpRequest();
    request.open('GET', "http://localhost:3000/quotes/save", true);
    request.send();
    request.onload = function(reponse){
      if (request.status >= 200 && request.status < 400) {
        console.log(request.responseText)
      } else {
        console.log("Server error", request.status);
      }
    }
  } else {
    console.log(currentTime.format('lll'), 'is outside current trade hours')
  }
}, 30000);