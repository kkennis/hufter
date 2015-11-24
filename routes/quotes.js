var express = require('express');
var router = express.Router();
var YFquotes = require('../queries/quotes.js');
var saveToMongo = require('../queries/save.js');
var mongoose = require('mongoose');
var uniq = require('uniq')

var tickerSchema = mongoose.Schema({ name: String });
var Ticker = mongoose.model('Ticker', tickerSchema);
var db = mongoose.connection;


router.use('/save*', function(req, res, next){
  if (db.readyState === 0) {
    console.log("Connecting");
    mongoose.connect('mongodb://localhost/test');
  }

  next();
})


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
        res.end("Data saved at " + new Date().toString());
      } else {
        res.send(response);
        res.end("Yahoo API Error")
      }
    })
  });
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



module.exports = router;
