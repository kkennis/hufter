var R = require('ramda');
var moment = require('moment');
var xhr = require("xmlhttprequest");

function getStockData(symbol, metrics, startDate, endDate){
  if (!metrics) { metrics = "*" } 
  else if (Array.isArray(metrics)) { metrics = metrics.concat(["Date"]).join(",") }

  if (!startDate) { startDate = moment().subtract(1, 'years').format("YYYY-MM-DD") }
  if (!endDate) { endDate = moment().format("YYYY-MM-DD") }

  // Initialize something to return
  var stockData = null;

  // This will always be the same
  var rootPath = 'https://query.yahooapis.com/v1/public/yql?q=';

  // I think this is a lot easier to read, it's more SQL-like, then we can 
  // just run it through JS's native URI encoder. Also super easy to just
  // drop in new queries through params (for future)
  var query = 'select ' + metrics + ' from yahoo.finance.historicaldata where symbol = "' + symbol + '"' + 
              ' and startDate = "' + startDate + '" and endDate="' + endDate + '"';

  // These will also always be the same, as far as I understand.
  var extraParams = '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

  // Build the full query URL here - whole point is to make the query itself more flexible if
  // we need to change it later. Note I'm encoding the query string
  var fullQuery = rootPath + encodeURIComponent(query) + extraParams;

  console.log(fullQuery);

  var XMLHttpRequest = xhr.XMLHttpRequest;
  var request = new XMLHttpRequest();
  request.open('GET', fullQuery, false);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      stockJSON = JSON.parse(request.responseText);
      stockData = stockJSON["query"]["results"]["quote"];
      stockData.ResolutionTime = stockJSON["query"]["diagnostics"]["user-time"];
    } else {
      console.log("Server error " + request.status);
    }
  };

  request.onerror = function() {
    console.log("Error: Could not connect")
  };

  request.send();

  return stockData;

}


getStockDatawithOptions = R.curry(getStockData);

module.exports.getHistoricalData = getStockData;
module.exports.getAllData = getStockDatawithOptions(R.__, null);
module.exports.getLastYear = getStockDatawithOptions(R.__, null, null, null);
module.exports.getVolume = getStockDatawithOptions(R.__, "Volume");
module.exports.getHighLow = getStockData(R.__, ["High", "Low"]);
module.exports.getOpenClose = getStockDatawithOptions(R.__, ["Open", "Close"]);
module.exports.getAdjClose = getStockDatawithOptions(R.__, "Adj_Close");



