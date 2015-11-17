var express = require('express');
var router = express.Router();
var YFhistoricaldata = require('../queries/historicaldata.js');
var backtest = require('../backtester/backtester.js');
var algo = require('../testalgo.js');
var CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");

var key = "yolocity";

function aesDecrypt(string,key){
  var decrypted = AES.decrypt(string, key);
  var decryptedString = CryptoJS.enc.Utf8.stringify(decrypted);
  return decryptedString;
}

function aesEncrypt(string,key){
  var encrypted = AES.encrypt(string,key);
  var encryptedString = encrypted.toString();
  return encryptedString;
}

router.post('/', function(req, res, next){
  // var encryptedAlgo = req.body.data;
  // Decrypt algo and turn into function
  // Also check delta-t

  // How to best send post data?

  new Promise(function(resolve, reject){
    var data = JSON.parse(aesDecrypt(req.body.data, key));

    var testingAlgo = (new Function('return ' + data.algo))(); 

    var stockData = YFhistoricaldata.getAllData(JSON.parse(data.symbols), data.startDate, data.endDate);

    if (stockData) { resolve(stockData); } 
    else { reject(Error("API Error")); }
  })
  .then(function(data){
    // backtest(decryptedAlgo, JSON.parse(req.body.symbols, data.results) );
    return backtest(data.algo, JSON.parse(req.body.symbols), data.results);
  })
  .then(function(results){ res.json(results); },
        function(error){ res.send(error); });  
});

module.exports = router;