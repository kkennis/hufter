var express = require('express');
var router = express.Router();
var YFquotes = require('../queries/quotes.js');

router.get('/', function(req, res, next) {
  var response;

  if (req.query.volume === "true"){
    YFquotes.getLastTradeWithVolume(req.query.symbols)
      .then((response) => res.json(response));
  } else if (req.query.alldata === "true"){
    YFquotes.getAllData(req.query.symbols)
      .then((response) => res.json(response));
  } else if (req.query.metrics){
    YFquotes.getStockData(req.query.symbols,
      decodeURIComponent(req.query.metrics).split(","))
      .then((response) => res.json(response))
  } else {
    YFquotes.getLastTrade(req.query.symbols)
      .then((response) => res.json(response))
  }
});

module.exports = router;
