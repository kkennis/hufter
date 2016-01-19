var _ = require('ramda');

function runBacktest(algo, data){
  var results = {};
  var stocks = data["results"];

  Object.keys(stocks).forEach(function(stock){
    results[stock] = {};
    var stockData = stocks[stock];
    var formattedData = _.reverse(_.map((quote) => [quote["Date"], quote["Close"]], stockData));
    console.log("Data==============================");
    console.log(algo(formattedData));
    console.log("==================================");
    results[stock]["signals"] = algo(formattedData);
  });

  return results;
}

module.exports = runBacktest;

