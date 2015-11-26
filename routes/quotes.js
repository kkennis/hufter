var express = require('express');
var router = express.Router();
var YFquotes = require('../queries/quotes.js');

router.get('/', function(req, res, next) {
  var response;

  if (req.query.volume === "true"){
    res.json(YFquotes.getLastTradeWithVolume(req.query.symbols));
  } else if (req.query.alldata === "true"){
    res.json(YFquotes.getAllData(req.query.symbols));
  } else if (req.query.metrics){
    res.json(YFquotes.getStockData(req.query.symbols,
               decodeURIComponent(req.query.metrics).split(",")));
  } else {
    // console.log("Yolo city")
    res.json(YFquotes.getLastTrade(req.query.symbols))
  }
});

module.exports = router;
