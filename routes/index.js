var express = require('express');
var router = express.Router();
var YFquotes = require('../queries/quotes.js')
var YFhistoricaldata = require('../queries/historicaldata.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Welcome to YQLPlus');
});

router.get('/quote/:symbol', function(req, res, next) {
  var response;

  if (req.query.volume === "true"){
    response = YFquotes.getLastTradeWithVolume(req.params.symbol);
  } else if (req.query.alldata === "true"){
    response = YFquotes.getAllData(req.params.symbol);
  } else if (req.query.metrics){
    response = YFquotes.getStockData(req.params.symbol,
                               decodeURIComponent(req.query.metrics).split(","));
  } else {
    response = YFquotes.getLastTrade(req.params.symbol)
  }
  res.json(response);
});


router.get('/historicaldata/:symbol', function(req, res, next) {
  var response;

  if (req.query.metrics) {
    metrics = decodeURIComponent(req.query.metrics).split(",");
    response = YFhistoricaldata.getHistoricalData(req.params.symbol, metrics, req.query.startDate, req.query.endDate);
  } else {
    response = YFhistoricaldata.getAllData(req.params.symbol, req.query.startDate, req.query.endDate);
  }

  res.json(response);
});

module.exports = router;
