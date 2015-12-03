var express = require('express');
var router = express.Router();
var YFquotes = require('../queries/quotes.js');
var _ = require('ramda')

router.get('/', function(req, res, next) {
  var response, symbols;
  var parseQuery = _.pipe(decodeURIComponent, _.split(","));
  if (req.query.symbols){
    symbols = parseQuery(req.query.symbols)
  }

  if (req.query.volume === "true"){
    YFquotes.getLastTradeWithVolume(symbols)
      .then((response) => res.json(response))
      .catch((err) => res.status(400).json({ "error": err }));
  } else if (req.query.alldata === "true"){
    YFquotes.getAllData(symbols)
      .then((response) => res.json(response))
      .catch((err) => res.status(400).json({ "error": err }));
  } else if (req.query.metrics){
    YFquotes.getStockData(symbols,
      decodeURIComponent(req.query.metrics).split(","))
      .then((response) => res.json(response))
      .catch((err) => res.status(400).json({ "error": err }));
  } else {
    YFquotes.getLastTrade(symbols)
      .then((response) => res.json(response))
      .catch((err) => res.status(400).json({ "error": err }));
  }
});

module.exports = router;
