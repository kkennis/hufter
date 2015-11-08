var express = require('express');
var router = express.Router();
var YFhistoricaldata = require('../queries/historicaldata.js');
var backtest = require('../backtester/backtester.js')
var algo = require('../testalgo.js')

router.post('/', function(req, res, next){
  // var encryptedAlgo = req.body.data;
  // Decrypt algo and turn into function
  // Also check delta-t

  // How to best send post data?

  new Promise(function(resolve, reject){
    var stockData = YFhistoricaldata.getAllData(JSON.parse(req.body.symbols), req.body.startDate, req.body.endDate)

    if (stockData) { resolve(stockData); } 
    else { reject(Error("API Error")); }
  })
  .then(function(data){
    // backtest(decryptedAlgo, JSON.parse(req.body.symbols, data.results) );
    return backtest(algo, JSON.parse(req.body.symbols), data.results);
  })
  .then(function(results){ res.json(results); },
        function(error){ res.send(error); });  
});

module.exports = router;