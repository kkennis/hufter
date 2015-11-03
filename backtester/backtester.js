var YFquotes = require('../queries/quotes.js')

function runBacktest(algo, stocks){
  var results = {};
  // YFquotes.getLastTrade(req.query.symbols)
  var signals = [];
  stocks.forEach(function(stock){
    signals.push(algo(stock));
  });


  var results = {};
  stocks.forEach(function(stock){
    results["symbol"] = stock["symbol"];
    results["symbol"]["LastTradedPrice"] = YFquotes.getLastTrade(results["symbol"]);
  });
  /*

  Metrics we want:
    * LTP - Last Traded Price
    * Change % - Stock change percentage over time frame
    * Avg. Daily Volume
    * Wins (gross and percentage)
    * Losses (gross and percentage)

  */

  return results;

}


module.exports = runBacktest;