var YFquotes = require('../queries/quotes.js');
var YFhistoricaldata = require('../queries/historicaldata.js');
var test = require('../testalgo.js');

function runBacktest(algo, stocks){
  var results = {};
  // YFquotes.getLastTrade(req.query.symbols)
  stocks.forEach(function(stock){
    var data = YFhistoricaldata.getAllData(stock, null, null);
    console.log(algo(data.results));
  });


  var results = {};
  stocks.forEach(function(stock){
    results["symbol"] = stock;
    results["symbol"]["LastTradedPrice"] = YFquotes.getLastTrade(stock).LastTradePriceOnly
    // results["symbol"]["signals"] = algo(stock);
  });

  setTimeout(function(){
    console.log(results)
  },10000);



  /*

  Metrics we want:
    * LTP - Last Traded Price
    * % Return
    * Change % - Stock change percentage over time frame
    * Avg. Daily Volume
    * Wins (gross and percentage)
    * Losses (gross and percentage)

  */

  return results;

}


runBacktest(test, ['DIG'])


module.exports = runBacktest;

