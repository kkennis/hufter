var R = require('ramda');
var moment = require('moment');
var needle = require('needle');
// TODO: Implement needle, use generators, make functionals

function getStockData(symbols, metrics, startDate, endDate){
  if (!metrics) { metrics = "*" }
  else if (R.type(metrics) === "String") { metrics = metrics + ", Symbol"}
  else if (R.type(metrics) === "Array") { metrics = metrics.concat(["Date", "Symbol"]).join(",") }

  if (!symbols) { symbols = '"SPY"' }
  else if (R.type(symbols) === "String") { symbols = '"' + symbols + '"' }
  else if (R.type(symbols) === "Array") { symbols = JSON.stringify(symbols).slice(1, -1) }

  if (!startDate) { startDate = moment().subtract(1, 'years').format("YYYY-MM-DD") }
  if (!endDate) { endDate = moment().format("YYYY-MM-DD") }

  var stockData = {};
  var rootPath = 'https://query.yahooapis.com/v1/public/yql?q=';
  var query = 'select ' + metrics + ' from yahoo.finance.historicaldata where symbol in (' + symbols + ')' +
              ' and startDate = "' + startDate + '" and endDate="' + endDate + '"';
  var extraParams = '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
  var fullQuery = rootPath + encodeURIComponent(query) + extraParams;


  return new Promise(function(resolve, reject){
    needle.get(fullQuery, function(err, res){
      if (err) reject(err);
      if (res.body["query"]["results"]){
        resolve(res.body["query"]["results"]["quote"]);
      } else {
        reject("API Error")
      }

    })
  })
}


getStockDatawithOptions = R.curry(getStockData);

module.exports.getHistoricalData = getStockData;
module.exports.getAllData = getStockDatawithOptions(R.__, null, R.__, R.__);
module.exports.getLastYear = getStockDatawithOptions(R.__, null, null, null);
module.exports.getVolume = getStockDatawithOptions(R.__, "Volume");
module.exports.getHighLow = getStockDatawithOptions(R.__, ["High", "Low"]);
module.exports.getOpenClose = getStockDatawithOptions(R.__, ["Open", "Close"]);
module.exports.getAdjClose = getStockDatawithOptions(R.__, "Adj_Close");



