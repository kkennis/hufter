var sup = require('./backtester/encrypt');
var fs = require('fs');
var xhrPromise = require('./utils/needle-promisify');
var AES = require("crypto-js/aes");


var query = {};
var cppAlgo = fs.readFileSync('./algos/testalgo.cpp', 'utf-8');

query["algo"] = cppAlgo;
query["startDate"] = "2015-06-01";
query["endDate"] = "2015-08-01";
query["symbols"] = JSON.stringify(["DIG", "TWTR"]);
query["lang"] = "cpp";

var query2 = fs.readFileSync('./algos/ryanstest.json', 'utf-8');
console.log(JSON.stringify(JSON.parse(query2)));
console.log("=====================================");
console.log(JSON.stringify(query));
// var qs = JSON.stringify(query2);
var qse = AES.encrypt(query2, "yolocity").toString();
console.log(typeof qse);


xhrPromise.get(`http://localhost:3000/backtest?data=${encodeURIComponent(qse)}`)
  .then((response) => fs.writeFile('testresponse.json', JSON.stringify(response.body, null, 4)))
  .catch((error) => console.log(error));



``