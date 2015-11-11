var YFhistoricaldata = require('../queries/historicaldata.js');
var R = require('ramda');


function runBacktest(algo, stocks, data){
  var results = { "overallStats": {} };

  // Does this even need to be a promise?  
  return new Promise(function(resolve, reject){

    stocks.forEach(function(stock){
      results[stock] = {};

      // Probably needs refactoring/better algorithm. Double nesting not good
      results[stock]["signals"] = algo(data.filter(function(entry){
        return entry["Symbol"] === stock;
      }));

      // var parser = R.compose(R.map(parseFloat), R.last)

      var buySignals = R.map(R.last, results[stock]["signals"]["buy"]).map(parseFloat);
      // var buySignals = R.compose(R.map(parseFloat), R.map(la)
      var totalBought = buySignals.reduce((memo, val) => memo + val);
      console.log(totalBought)
      // console.log(totalBought)

      var sellSignals = R.map(R.last, results[stock]["signals"]["sell"]).map(parseFloat); 
      var totalSold = sellSignals.reduce((memo, val) => memo + val)
      console.log(totalSold)

      results[stock]["Total Bought"] = totalBought;
      results[stock]["Total Sold"] = totalSold;
      results[stock]["ROI"] = (totalSold - totalBought) / totalBought;
      results[stock]["GrossReturn"] = totalSold - totalBought;
    });

    resolve(results);
  });


  /*

  Metrics we want:
    * % Return
    * Change % - Stock change percentage over time frame
    * Avg. Daily Volume
    * Wins (gross and percentage)
    * Losses (gross and percentage)
    * Volatility

    Do it right before resolve - maybe extract to function
  */
}

module.exports = runBacktest;

