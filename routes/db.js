var express = require('express');
var router = express.Router();
var YFquotes = require('../queries/quotes.js');
var mongoose = require('mongoose');

var db = mongoose.connection;
var host = process.env["DB_HOST"]

var getTickers = require('../db/query-mongo.js');
var saveToMongo = require('../db/save-mongo.js');
var Ticker = mongoose.model('Ticker');

router.use('*', function(req, res, next){
  if (db.readyState === 0) {
    Promise.resolve(mongoose.connect(host)).then(next());
  } else {
    next();
  }
});

router.get('/save', function(req, res, next) {
  console.log("Saving...");

  getTickers()
    .then((tickers) => YFquotes.getLastTrade(tickers))
    .then((response) => saveToMongo(response))
    .then((saveStatuses, err) => res.end(err || saveStatuses))
});

router.get('/save/all', function(req, res, next){
  getTickers().then((symbols) => res.end(symbols.join(", ")))
})


router.get('/save/:ticker', function(req, res, next){
  console.log("Saving ticker...", req.params.ticker.toString('utf8'));
  var newSymbol = new Ticker({ name: req.params.ticker.toString('utf8') });

  newSymbol.save()
    .then((data, err) => res.end(err || "Successfully saved stock"))
});

router.get('/disconnect', function(req, res, next){
  if (db.readyState === 1){
    mongoose.disconnect();
  }
  res.end("Disconnected from database at " + new Date().toString());
});

module.exports = router;