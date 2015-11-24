var YFhistoricaldata = require('../queries/historicaldata.js');
var R = require('ramda');


function runBacktest(algo, stocks, data){
  var results = {};
  var numPeriods = null;

  // Does this even need to be a promise?  
    console.log("Promising...");

    stocks.forEach(function(stock){
      results[stock] = {};

      var stockData = data.filter(function(entry){
        return entry["Symbol"] === stock;
      });

      if (!numPeriods) numPeriods = stockData.length;

      // Probably needs refactoring/better algorithm. Double nesting not good
      // console.log("Stock symbol 2", stockData);
      filteredData = stockData.map(function(quote){
        return [quote["Date"], quote["Close"]]
      });

      results[stock]["signals"] = algo(filteredData);

      var buySignals = results[stock]["signals"]["buy"].map(R.last).map(parseFloat);
      var totalBought = buySignals.reduce((memo, val) => memo + val);

      var sellSignals = results[stock]["signals"]["sell"].map(R.last).map(parseFloat); 
      var totalSold = sellSignals.reduce((memo, val) => memo + val);

      results[stock]["TotalBought"] = totalBought;
      results[stock]["TotalSold"] = totalSold;
      results[stock]["ROI"] = (totalSold - totalBought) / totalBought;
      results[stock]["GrossReturn"] = totalSold - totalBought;

      var totalVolume = stockData.map(function(datum){
                          return parseInt(datum["Volume"], 10);
                        }).reduce((memo, val) => memo + val);

      results[stock]["TotalVolume"] = totalVolume;
      results[stock]["AverageDailyVolume"] = totalVolume / stockData.length; 
      // Buy/Sell Count & Buys/Sells per day

      results[stock]["TotalBuys"] = buySignals.length;
      results[stock]["TotalSells"] = sellSignals.length;
      results[stock]["BuysPerPeriod"] = buySignals.length /  numPeriods;
      results[stock]["SellsPerPeriod"] = sellSignals.length /  numPeriods;
      
      results[stock]["TotalTrades"] = buySignals.length + sellSignals.length;
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

    overallStats["TotalBuys"] = Object.keys(results)
                                      .map((stock) => results[stock]["TotalBuys"])
                                      .reduce((memo, val) => memo + val);

    overallStats["TotalSells"] = Object.keys(results)
                                       .map((stock) => results[stock]["TotalSells"])
                                       .reduce((memo, val) => memo + val);

    overallStats["BuysPerPeriod"] = Object.keys(results)
                                          .map((stock) => results[stock]["BuysPerPeriod"])
                                          .reduce((memo, val) => memo + val);

    overallStats["SellsPerPeriod"] = Object.keys(results)
                                          .map((stock) => results[stock]["SellsPerPeriod"])
                                          .reduce((memo, val) => memo + val);

    overallStats["TotalTrades"] = overallStats["TotalBuys"] + overallStats["TotalSells"];

    results["TotalStats"] = overallStats;

    // console.log(results)


    return results;


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

