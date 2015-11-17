var express = require('express');
var router = express.Router();
var YFquotes = require('../queries/quotes.js');
var saveToMongo = require('../queries/save.js');
var mongoose = require('mongoose');
var uniq = require('uniq')

var tickerSchema, Ticker, db;

tickerSchema = mongoose.Schema({ name: String });

Ticker = mongoose.model('Ticker', tickerSchema);

db = mongoose.connection;


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
  console.log("Saving...");

  mongoose.connect('mongodb://localhost/test');


  db.once('open', function(){
      Ticker.find({},function(err, tickers){
        var symbols = tickers.map(function(ticker){
          return ticker["name"];
        })

        new Promise(function(resolve, reject){
          response = YFquotes.getLastTrade(uniq(symbols));
          resolve(response);
        })
        .then(function(response){
          if (Object.keys(response).length !== 0){
            saveToMongo(response);
            res.end("Request received at " + new Date().toString());
          } else {
            res.send(response);
            res.end("Yahoo API Error")
          }
        })
      });
  });

});

router.get('/save/:ticker', function(req, res, next){
  console.log("Saving ticker...", req.params.ticker.toString('utf8'));
  mongoose.connect('mongodb://localhost/test');

  db.once('open', function(){
    var newSymbol = new Ticker({ name: req.params.ticker.toString('utf8') });
    
    newSymbol.save(function(err, symbol){
      if (err){
        res.end("Error saving stock")
        mongoose.disconnect();
      } else {
        res.end("Successfully saved stock")
        mongoose.disconnect();
      }
    });

  });

});

module.exports = router;
