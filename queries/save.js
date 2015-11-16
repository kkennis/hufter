var mongoose = require('mongoose');
var moment = require('moment');
var tz = require('moment-timezone');
var YFquotes = require('./quotes');

var quoteSchema = mongoose.Schema({
  symbol: String,
  lastTradePrice: Number,
  timestamp: Number
});

var Quote = mongoose.model('Quote', quoteSchema);

var save = function(stocks){
  var currentTime = moment().tz('America/New_York');
  var openTime = moment('09:30', 'HH:MM');
  var closeTime = moment('16:00', 'HH:MM');
  var db = mongoose.connection;

  if (currentTime.isBetween(openTime, closeTime)){
    if (db.readyState === 0) {
      console.log("Connecting to database at", moment().format('lll'), "(", moment().tz('America/New_York').format('lll'), " market time )");
      mongoose.connect('mongodb://localhost/test');
    }

    db.on('error', console.error.bind(console, 'connection error:'));

    if (db.readyState === 1) {
      stocks.forEach(function(stock){
        if (stock["LastTradePriceOnly"]) {
          var currentQuote = new Quote({
                                          symbol: stock["Symbol"],
                                          lastTradePrice: stock["LastTradePriceOnly"],
                                          timestamp: new Date().getTime()
                                      });

          currentQuote.save(function(err, quote){
            if (err){
              console.log(err);
            } else {
              console.log("Quote for ", quote.symbol, "saved at ", moment().format('lll'));
            }
          });
        } else {
          console.log("Could not save trade data for ", stock["Symbol"], " at ", moment().format('lll'), "(", moment().tz('America/New_York').format('lll'), "market time )");
        }
      });
    }


  } else {
    console.log("Outside current trade hours. Disconnecting from database at", moment().format('lll'), "(", moment().tz('America/New_York').format('lll'), "market time )");
    mongoose.disconnect();
  }
}


module.exports = save;