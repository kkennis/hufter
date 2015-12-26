var express = require('express');
var router = express.Router();
var YFhistoricaldata = require('../queries/historicaldata.js');
var backtest = require('../backtester/backtester.js');
var crypter = require('../backtester/encrypt.js');
var calculateStats = require('../backtester/stats.js');
var algo = require('../algos/testalgo.js');
var compiler = require('../native/compile.js');
var _ = require('ramda');



// THIS should be post
router.get('/', function(req, res, next){
  // var encryptedAlgo = req.body.data;
  // Decrypt algo and turn into function
  // Also check delta-t

  // How to best send post data?
  var data = crypter.decrypt(decodeURIComponent(req.query.data));
  data = JSON.parse(data);

  var symbols = JSON.parse(data.symbols).concat("TWTR");
  var numPeriods;

  new Promise(function(resolve, reject){
    var stockData = YFhistoricaldata.getAllData(symbols, data.startDate, data.endDate);

    if (stockData) { resolve(stockData); }
    else { reject(new Error("API Error")); }
  })
  .then(function(stockData){
    getPeriods = _.pipe(_.path(['results', _.head(symbols)]), _.length);
    numPeriods = getPeriods(stockData);

    if (req.query.lang === "cpp"){
      return compiler(data.algo, stockData);
    } else {
      var jsAlgo = (new Function('return ' + data.algo))();
      return backtest(jsAlgo, stockData);
    }
  })
  .then(function(testedData){
    return calculateStats(testedData, numPeriods);
  })
  .then((results) => res.json(results))
  .catch((err) => res.status(400).json({ error: err }));
});

module.exports = router;