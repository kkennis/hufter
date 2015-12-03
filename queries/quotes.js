var _ = require('ramda');
var needle = require('needle');


var getStockData = function (symbols, metrics){
  var response = {};

  symbols = parseSymbols(symbols);
  metrics = parseMetrics(metrics);

  var fullQuery = buildQuery(symbols, metrics);

  // Error checking - all fields except symbol are null

  return new Promise(function(resolve, reject){
    needle.get(fullQuery, function(err, res){
      if (err) reject(err);

      var stockData = res.body["query"]["results"]["quote"];
      // console.log(stockData);

      var elimSymbol = dataSet => _.pipe(Object.keys, _.reject(_.equals('Symbol')), _.pick(_.__, dataSet))
      var getVals = obj => _.map((key) => obj[key], Object.keys(obj));
      var checkAllNull = _.all(_.equals(null));
      var noResult = dataSet => _.pipe(elimSymbol(dataSet), getVals, checkAllNull)(dataSet);

      if (_.type(stockData) === "Array"){
        var invalidSymbols = [];

        stockData.forEach(function(stock){
          if (noResult(stock)) {
            invalidSymbols.push(stock["Symbol"]);
          }
        });
        if (!_.isEmpty(invalidSymbols)){
          response["results"] = _.reject((stock) => _.contains(stock["Symbol"], invalidSymbols), stockData);
          response.error = `No quote information found for ticker ${invalidSymbols.join(", ")}`;
          if (_.isEmpty(response["results"])) delete response["results"];
        } else {
          response["results"] = stockData;
        }
        response.ResolutionTime = res.body["query"]["diagnostics"]["user-time"];
        resolve(response);
      } else {
        if (noResult(stockData)){
          reject(`No quote information found for ticker ${symbols}`)
        } else {
          response["results"] = stockData;
          resolve(response);
        }
      }



    });
  });
};

function parseSymbols(symbols){
  if (!symbols) { symbols = 'SPY' }
  else if (_.type(symbols) === "Array") { symbols = symbols.join('","') }
  return symbols;
}

function parseMetrics(metrics){
  if (!metrics) { metrics = '*' }
  else if (_.type(metrics) === "String") { metrics = metrics + ", Symbol"}
  else if (_.type(metrics) === "Array") { metrics = metrics.concat("Symbol").join(',') }
  return metrics;
}

function buildQuery(symbols, metrics){
  var rootPath = 'https://query.yahooapis.com/v1/public/yql?q=';
  var query = 'select ' + metrics + ' from yahoo.finance.quotes where symbol in ("' + symbols + '")';
  var extraParams = '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
  return rootPath + encodeURIComponent(query) + extraParams;
}



getStockDatawithOptions = _.curry(getStockData);

module.exports.getStockData = getStockData;
module.exports.getAllData = getStockDatawithOptions(_.__, null);
module.exports.getLastTrade = getStockDatawithOptions(_.__, "LastTradePriceOnly");
module.exports.getVolume = getStockDatawithOptions(_.__, "Volume");
module.exports.getLastTradeWithVolume = getStockDatawithOptions(_.__, ["LastTradePriceOnly", "Volume"])
module.exports.getAverageDailyVolume = getStockDatawithOptions(_.__, "AverageDailyVolume")



