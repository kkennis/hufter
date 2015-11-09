var YFhistoricaldata = require('../queries/historicaldata.js');

function runBacktest(algo, stocks, data){
  var results = {};

  // Does this even need to be a promise?  
  return new Promise(function(resolve, reject){

    stocks.forEach(function(stock){
      results[stock] = {};

      // Probably needs refactoring/better algorithm. Doube=le nesting not good
      results[stock]["signals"] = algo(data.filter(function(entry){
        return entry["Symbol"] === stock;
      }));
    });

    if (JSON.stringify(Object.keys(results)) == JSON.stringify(stocks)){
      resolve(results);
    } else {
      reject(Error("Could not retrieve all stock data"));
    }
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

