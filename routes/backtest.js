// REFACTOR THIS
var express = require('express');
var router = express.Router();
var YFhistoricaldata = require('../queries/historicaldata.js');
var backtest = require('../backtester/backtester.js');
var crypter = require('../backtester/encrypt.js')
var algo = require('../testalgo.js');



// THIS should be post
router.get('/', function(req, res, next){
  // var encryptedAlgo = req.body.data;
  // Decrypt algo and turn into function
  // Also check delta-t

  // How to best send post data?
  var data = crypter.decrypt(decodeURIComponent(req.query.data));
  data = JSON.parse(data);

  var symbols = JSON.parse(data.symbols).concat("TWTR")

  new Promise(function(resolve, reject){

    var stockData = YFhistoricaldata.getAllData(symbols, data.startDate, data.endDate);

    if (stockData) { resolve(stockData); }
    else { reject(Error("API Error")); }
  })
  .then(function(stockData){
    var testingAlgo = (new Function('return ' + data.algo))();

    return backtest(testingAlgo, stockData);
  })
  .then(function(results){ res.json(results); },
        function(error){ res.end(error); });
});

module.exports = router;