var mongoose = require('mongoose');
var moment = require('moment');
var tz = require('moment-timezone');
var range = require('moment-range');
var YFquotes = require('../queries/quotes');

var quoteSchema = mongoose.Schema({
  symbol: String,
  lastTradePrice: Number,
  timestamp: Number
});

var Quote = mongoose.model('Quote', quoteSchema);

var save = function(stocks){
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
          console.log("Quote for", quote.symbol, "saved at", moment().format('lll'));
        }
      });
    } else {
      console.log("Could not save trade data for ", stock["Symbol"], " at ", moment().format('lll'), "(", moment().tz('America/New_York').format('lll'), "market time )");
    }
  });
}



module.exports = save;