var mongoose = require('mongoose');
var moment = require('moment');
var YFquotes = require('../queries/quotes');

var quoteSchema = mongoose.Schema({
  symbol: String,
  lastTradePrice: Number,
  timestamp: Number
});

var Quote = mongoose.model('Quote', quoteSchema);

var save = function(stocks){
  return new Promise(function (resolve, reject){
    stocks.forEach(function(stock){
      if (stock["LastTradePriceOnly"]) {
        var currentQuote = new Quote({
          symbol: stock["Symbol"],
          lastTradePrice: stock["LastTradePriceOnly"],
          timestamp: new Date().getTime()
        });
        currentQuote.save((err, data) => console.log("Quote for", stock["Symbol"], "saved at", moment().format('lll')))

      } else {
        console.log("Could not save trade data for ", stock["Symbol"], " at ", moment().format('lll'), "(", moment().tz('America/New_York').format('lll'), "market time )");
        reject("Things haven't saved!")
      }
    });

    resolve("Successfully saved data at " + moment().format('lll'));
  });

}



module.exports = save;