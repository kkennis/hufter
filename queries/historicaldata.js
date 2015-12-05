var _ = require('ramda');
var moment = require('moment');
var needle = require('needle');
// TODO: Implement needle, use generators, make functionals

function getStockData(symbols, metrics, startDate, endDate){
  if (!metrics) { metrics = "*" }
  else if (_.type(metrics) === "String") { metrics = metrics + ", Symbol"}
  else if (_.type(metrics) === "Array") { metrics = metrics.concat(["Date", "Symbol"]).join(",") }

  if (!symbols) { symbols = '"SPY"' }
  else if (_.type(symbols) === "String") { symbols = '"' + symbols + '"' }
  else if (_.type(symbols) === "Array") { symbols = JSON.stringify(symbols).slice(1, -1) }

  if (!startDate) { startDate = moment().subtract(1, 'years').format("YYYY-MM-DD") }
  if (!endDate) { endDate = moment().format("YYYY-MM-DD") }

  var stockData = {};
  var rootPath = 'https://query.yahooapis.com/v1/public/yql?q=';
  var query = 'select ' + metrics + ' from yahoo.finance.historicaldata where symbol in (' + symbols + ')' +
              ' and startDate = "' + startDate + '" and endDate="' + endDate + '"';
  var extraParams = '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
  var fullQuery = rootPath + encodeURIComponent(query) + extraParams;


  // No error checking yet...at all
  return new Promise(function(resolve, reject){
    needle.get(fullQuery, function(err, res){
      if (err) reject(err);
      if (res.body["query"]["results"]){

        var results = _.groupBy(_.prop("Symbol"), res.body["query"]["results"]["quote"]);
        var response = { "results": results }
        resolve(response);
      } else {
        reject("API Error")
      }

    })
  });
}

getStockDatawithOptions = _.curry(getStockData);

module.exports.getHistoricalData = getStockData;
module.exports.getAllData = getStockDatawithOptions(_.__, null, _.__, _.__);
module.exports.getLastYear = getStockDatawithOptions(_.__, null, null, null);
module.exports.getVolume = getStockDatawithOptions(_.__, "Volume");
module.exports.getHighLow = getStockDatawithOptions(_.__, ["High", "Low"]);
module.exports.getOpenClose = getStockDatawithOptions(_.__, ["Open", "Close"]);
module.exports.getAdjClose = getStockDatawithOptions(_.__, "Adj_Close");



