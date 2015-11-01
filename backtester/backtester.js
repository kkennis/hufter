var YFquotes = require('../queries/quotes.js')

function runBacktest(algo, stockData){
  var results = {};
  YFquotes.getLastTrade(req.query.symbols)
  var signals = algo(stockData);

  /*

  Metrics we want:
    * LTP - Last Traded Price
    * Change % - Stock change percentage over time frame
    * Avg. Daily Volume
    * Wins (gross and percentage)
    * Losses (gross and percentage)

  */

}


module.exports = runBacktest;