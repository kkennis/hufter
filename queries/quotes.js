var _ = require('ramda');
var needle = require('needle');
var xhrPromise = require('../utils/needle-promisify');

var getStockData = function (symbols, metrics){
  var url = buildQuery(parseSymbols(symbols), parseMetrics(metrics));

  return xhrPromise.get(url)
    .then(function(res){
      var response = {
        results: [].concat(res.body["query"]["results"]["quote"]),
        ResolutionTime: res.body["query"]["diagnostics"]["user-time"]
      }

      response = _.mergeAll([
        response,
        checkInvalidTickers(response),
        checkInvalidMetrics(metrics, response)
      ]);

      if (_.isEmpty(response["results"])) { throw new Error(response.tickerError); }
      else { return response; }
    });
}


function parseSymbols(symbols){
  if (!symbols) { return 'SPY'; }
  else if (_.type(symbols) === "Array") { return symbols.join('","'); }
}

function parseMetrics(metrics){
  if (!metrics) { return '*'; }
  else if (_.type(metrics) === "String") { return metrics + ",Symbol"; }
  else if (_.type(metrics) === "Array") { return metrics.concat("Symbol").join(','); }
}

function buildQuery(symbols, metrics){
  var rootPath = 'https://query.yahooapis.com/v1/public/yql?q=';
  var query = `select ${metrics} from yahoo.finance.quotes where symbol in ("${symbols}")`;
  var extraParams = '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
  return rootPath + encodeURIComponent(query) + extraParams;
}

function noResult(stockResult){
  var elimSymbol = dataSet => _.pipe(Object.keys, _.reject(_.equals('Symbol')), _.pick(_.__, dataSet))
  var getVals = obj => _.map((key) => obj[key], Object.keys(obj));
  var checkAllNull = _.all(_.equals(null));
  return _.pipe(elimSymbol(stockResult), getVals, checkAllNull)(stockResult);
}

function checkInvalidTickers(stockData){
  var parsedResult = {};
  var getInvalidSymbols = _.pipe(_.prop('results'), _.filter(noResult), _.pluck('Symbol'));
  var invalidSymbols = getInvalidSymbols(stockData);

  if (!_.isEmpty(invalidSymbols)){
    var isInvalid = (stock) => _.contains(stock["Symbol"], invalidSymbols);
    parsedResult["results"] = _.reject(isInvalid, stockData["results"]);
    parsedResult.tickerError = `No quote information found for ticker(s) ${invalidSymbols.join(", ")}`;
  } else {
    parsedResult["results"] = stockData["results"];
  }
  return parsedResult;
}

function checkInvalidMetrics(metrics, stockData){
  if (!metrics) return {};
  if (_.type(metrics) !== "Array") { metrics = [metrics] }

  var validMetrics = Object.keys(stockData["results"][0]);
  var isValid = _.contains(_.__, validMetrics);
  var invalidMetrics = _.reject(isValid, metrics);
  var metricsError = `No such metrics ${invalidMetrics.join(", ")}. Please refer to documentation for possible metrics.`
  return _.isEmpty(invalidMetrics) ? {} : { metricsError: metricsError };
}

getStockDatawithOptions = _.curry(getStockData);

module.exports.getStockData = getStockData;
module.exports.getAllData = getStockDatawithOptions(_.__, null);
module.exports.getLastTrade = getStockDatawithOptions(_.__, "LastTradePriceOnly");
module.exports.getVolume = getStockDatawithOptions(_.__, "Volume");
module.exports.getLastTradeWithVolume = getStockDatawithOptions(_.__, ["LastTradePriceOnly", "Volume"])
module.exports.getAverageDailyVolume = getStockDatawithOptions(_.__, "AverageDailyVolume")



