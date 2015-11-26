var _ = require('ramda');
var xhr = require('xmlhttprequest')
// var needle = require('needle');
// TODO: Implement needle, use generators, make functionals

var getStockData = function (symbols, metrics){

  if (!metrics) { metrics = '*' } 
  else if (_.type(metrics) === "String") { metrics = metrics + ", Symbol"}
  else if (_.type(metrics) === "Array") { metrics = metrics.concat("Symbol").join(',') }

  if (!symbols) { symbols = 'SPY' } 
  else if (_.type(symbols) === "Array") { symbols = symbols.join('","') }

  var rootPath = 'https://query.yahooapis.com/v1/public/yql?q=';
  var query = 'select ' + metrics + ' from yahoo.finance.quotes where symbol in ("' + symbols + '")';
  var extraParams = '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
  var fullQuery = rootPath + encodeURIComponent(query) + extraParams;

  var stockData = {};
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
    console.log("Error: Could not connect");
  };

  request.send();

  return stockData;

};


getStockDatawithOptions = _.curry(getStockData);

module.exports.getStockData = getStockData;
module.exports.getAllData = getStockDatawithOptions(_.__, null);
module.exports.getLastTrade = getStockDatawithOptions(_.__, "LastTradePriceOnly");
module.exports.getVolume = getStockDatawithOptions(_.__, "Volume");
module.exports.getLastTradeWithVolume = getStockDatawithOptions(_.__, ["LastTradePriceOnly", "Volume"])
module.exports.getAverageDailyVolume = getStockDatawithOptions(_.__, "AverageDailyVolume")



