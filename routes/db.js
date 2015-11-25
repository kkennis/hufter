// REFACTOR THIS

var express = require('express');
var router = express.Router();
var YFquotes = require('../queries/quotes.js');
var mongoose = require('mongoose');
var uniq = require('uniq');

var db = mongoose.connection;
var host = process.env["DB_HOST"]

var getTickers = require('../db/query-mongo.js');
var saveToMongo = require('../db/save-mongo.js');
// var tickerSchema = mongoose.Schema({ name: String });
// var Ticker = mongoose.model('Ticker', tickerSchema);

router.use('/save*', function(req, res, next){
  if (db.readyState === 0) {
    console.log("Connecting...");
    mongoose.connect(host);
  }

  next();
})

router.get('/save', function(req, res, next) {
  console.log("Saving...");

  // Make this async sync
  var tickers = getTickers();
  var response = YFquotes.getLastTrade(tickers);
  var saveStatus = saveToMongo(response)
  res.end(saveStatus);




  // Ticker.find({},function(err, tickers){
  //   var symbols = tickers.map(function(ticker){
  //     return ticker["name"];
  //   })

  //   new Promise(function(resolve, reject){
  //     response = YFquotes.getLastTrade(uniq(symbols));
  //     resolve(response);
  //   })
  //   .then(function(response){
  //     if (Object.keys(response).length !== 0){
  //       saveToMongo(response);
  //       res.end("Data saved at " + new Date().toString());
  //     } else {
  //       res.send(response);
  //       res.end("Yahoo API Error")
  //     }
  //   })
  // });
});

router.get('/save/all', function(req, res, next){
  console.log("Retrieving list of stocks...");
  Ticker.find({},function(err, tickers){
    if (err) res.end(err);

    var symbols = tickers.map((ticker) => ticker["name"])
    res.end(uniq(symbols).join(", "))
  });
})


router.get('/save/:ticker', function(req, res, next){
  console.log("Saving ticker...", req.params.ticker.toString('utf8'));
  var newSymbol = new Ticker({ name: req.params.ticker.toString('utf8') });    
  newSymbol.save(function(err, symbol){
    if (err){
      res.end("Error saving stock")
    } else {
      res.end("Successfully saved stock")
    }
  });
});

router.get('/disconnect', function(req, res, next){
  if (db.readyState === 1){
    mongoose.disconnect();
  }
  res.end("Disconnected from database at " + new Date().toString());
});