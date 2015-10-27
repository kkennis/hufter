var express = require('express');
var router = express.Router();
var YF = require('../queries/query.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Welcome to YQLPlus');
});

router.get('/quote/:ticker', function(req, res, next) {
  if (req.query.volume === "true"){
    response = YF.getLastTradeWithVolume(req.params.ticker);
  } else if (req.query.alldata === "true"){
    response = YF.getAllData(req.params.ticker);
  } else if (req.query.metrics){
    response = YF.getStockData(req.params.ticker,
                               decodeURIComponent(req.query.metrics).split(","));
  } else {
    response = YF.getLastTrade(req.params.ticker)
  }
  res.json(response);
});


router.get('/historicaldata/:ticker', function(req, res, next) {
  res.json({ message: 'You requested stock ' + req.params.ticker });
});

module.exports = router;
