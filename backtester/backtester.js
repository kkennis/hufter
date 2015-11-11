var YFhistoricaldata = require('../queries/historicaldata.js');
var R = require('ramda');


function runBacktest(algo, stocks, data){
  var results = {};

  // Does this even need to be a promise?  
  return new Promise(function(resolve, reject){

    stocks.forEach(function(stock){
      results[stock] = {};

      var stockData = data.filter(function(entry){
        return entry["Symbol"] === stock;
      });

      // Probably needs refactoring/better algorithm. Double nesting not good
      results[stock]["signals"] = algo(stockData);

      var buySignals = R.map(R.last, results[stock]["signals"]["buy"]).map(parseFloat);
      var totalBought = buySignals.reduce((memo, val) => memo + val);

      var sellSignals = R.map(R.last, results[stock]["signals"]["sell"]).map(parseFloat); 
      var totalSold = sellSignals.reduce((memo, val) => memo + val);

      results[stock]["TotalBought"] = totalBought;
      results[stock]["TotalSold"] = totalSold;
      results[stock]["ROI"] = (totalSold - totalBought) / totalBought;
      results[stock]["GrossReturn"] = totalSold - totalBought;

      var totalVolume = stockData.map(function(datum){
                          return parseInt(datum["Volume"], 10);
                        }).reduce(function(memo, val) {
                          return memo + val;
                        });

      results[stock]["TotalVolume"] = totalVolume
      results[stock]["AverageDailyVolume"] = totalVolume / stockData.length; 
      // Buy/Sell Count & Buys/Sells per day
    });

    var overallStats = {};

    var overallBought = Object.keys(results)
                              .map((stock) => results[stock]["TotalBought"])
                              .reduce((memo, val) => memo + val);

    var overallSold = Object.keys(results)
                            .map((stock) => results[stock]["TotalSold"])
                            .reduce((memo, val) => memo + val);

    overallStats["TotalBought"] = overallBought;
    overallStats["TotalSold"] = overallSold;
    overallStats["ROI"] = (overallSold - overallBought) / overallBought;
    overallStats["GrossReturn"] = overallSold - overallBought;

    var overallVolume = Object.keys(results)
                              .map((stock) => results[stock]["TotalVolume"])
                              .reduce((memo, val) => memo + val);

    overallStats["TotalVolume"] = overallVolume
    overallStats["AverageDailyVolume"] = overallVolume / Object.keys(results).length;


    results["TotalStats"] = overallStats;


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

