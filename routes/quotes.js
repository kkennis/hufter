var express = require('express');
var router = express.Router();
var YFquotes = require('../queries/quotes.js');
var _ = require('ramda')

router.get('/', function(req, res, next) {
  var symbols, request;
  var parseQuery = _.pipe(decodeURIComponent, _.split(","));
  if (req.query.symbols) { symbols = parseQuery(req.query.symbols) }

  if (req.query.volume === "true"){
    request = YFquotes.getLastTradeWithVolume(symbols)
  } else if (req.query.alldata === "true"){
    request = YFquotes.getAllData(symbols)
  } else if (req.query.metrics){
    request = YFquotes.getStockData(symbols, parseQuery(req.query.metrics))
  } else {
    request = YFquotes.getLastTrade(symbols)
  }

  request
    .then((response) => res.json(response))
    .catch((err) => res.status(400).json({ "error": err }));
});

module.exports = router;
