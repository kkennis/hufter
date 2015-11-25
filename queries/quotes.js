var R = require('ramda');
var xhr = require("xmlhttprequest");


function getStockData(symbols, metrics){
  if (!metrics) { metrics = '*' } 
  else if (R.type(metrics) === "String") { metrics = metrics + ", Symbol"}
  else if (R.type(metrics) === "Array") { metrics = metrics.concat("Symbol").join(',') }

  if (!symbols) { symbols = 'SPY' } 
  else if (R.type(symbols) === "Array") { symbols = symbols.join('","') }

  // Initialize something to return
  var stockData = {};

  // This will always be the same
  var rootPath = 'https://query.yahooapis.com/v1/public/yql?q=';

  // I think this is a lot easier to read, it's more SQL-like, then we can 
  // just run it through JS's native URI encoder. Also super easy to just
  // drop in new queries through params (for future)
  var query = 'select ' + metrics + ' from yahoo.finance.quotes where symbol in ("' + symbols + '")';

  // These will also always be the same, as far as I understand.
  var extraParams = '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

  // Build the full query URL here - whole point is to make the query itself more flexible if
  // we need to change it later. Note I'm encoding the query string
  var fullQuery = rootPath + encodeURIComponent(query) + extraParams;

  var XMLHttpRequest = xhr.XMLHttpRequest;
  var request = new XMLHttpRequest();
  request.open('GET', fullQuery, false);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      stockJSON = JSON.parse(request.responseText);
      stockData = stockJSON["query"]["results"]["quote"];
      stockData.ResolutionTime = stockJSON["query"]["diagnostics"]["user-time"];
    } else {
      console.log("Server error", request.status);
    }
  };

  request.onerror = function() {
    console.log("Error: Could not connect")
  };

  request.send();

  return stockData;

}


getStockDatawithOptions = R.curry(getStockData);

module.exports.getStockData = getStockData;
module.exports.getAllData = getStockDatawithOptions(R.__, null);
module.exports.getLastTrade = getStockDatawithOptions(R.__, "LastTradePriceOnly");
module.exports.getVolume = getStockDatawithOptions(R.__, "Volume");
module.exports.getLastTradeWithVolume = getStockDatawithOptions(R.__, ["LastTradePriceOnly", "Volume"])
module.exports.getAverageDailyVolume = getStockDatawithOptions(R.__, "AverageDailyVolume")



