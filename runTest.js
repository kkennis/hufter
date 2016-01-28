var fs = require('fs');
var CryptoJS = require("crypto-js");
var AES = require("crypto-js/aes");
var xhr = require('./utils/needle-promisify')


var algoString = fs.readFileSync('./algos/testalgo.cpp');
var startDate = '2015-03-01';
var endDate = '2016-01-24';
var symbols = '["P"]';
var lang = "cpp";

var request = {};

request.algo = algoString;
request.startDate = startDate;
request.endDate = endDate;
request.symbols = symbols;
request.lang = lang;

var queryString = aesEncrypt(JSON.stringify(request), 'yolocity');
console.log(queryString)

xhr.get(`http://hufter.herokuapp.com/backtest?data=${encodeURIComponent(queryString)}`)
  .then(function(res){
    fs.writeFile('yolotest.json', JSON.stringify(res.body, null, 4));
  })


function aesEncrypt(string,key){
  var encrypted = AES.encrypt(string,key);
  var encryptedString = encrypted.toString();
  return encryptedString;
}