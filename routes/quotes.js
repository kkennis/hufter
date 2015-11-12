var express = require('express');
var router = express.Router();
var YFquotes = require('../queries/quotes.js');
var saveToMongo = require('../queries/save.js')

router.get('/', function(req, res, next) {
  var response;

  if (req.query.volume === "true"){
    response = YFquotes.getLastTradeWithVolume(req.query.symbols);
  } else if (req.query.alldata === "true"){
    response = YFquotes.getAllData(req.query.symbols);
  } else if (req.query.metrics){
    response = YFquotes.getStockData(req.query.symbols,
                               decodeURIComponent(req.query.metrics).split(","));
  } else {
    response = YFquotes.getLastTrade(req.query.symbols)
  }
  res.json(response);
});

router.get('/save', function(req, res, next) {
  response = YFquotes.getLastTrade(req.query.symbols);
  saveToMongo(response);
  res.json({ "Status": "Data saved at ".concat(new Date().toString()) })
});


module.exports = router;
