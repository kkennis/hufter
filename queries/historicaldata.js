var _ = require('ramda');
var moment = require('moment');
var xhrPromise = require('../utils/needle-promisify');
var needle = require('needle')
// TODO: Implement needle, use generators, make functionals

function getStockData(symbols, metrics, startDate, endDate){

  var startDateResult = parseStartDate(startDate);
  var endDateResult = parseEndDate(endDate);

  if (!moment(startDateResult).isValid()) { return Promise.reject(startDate) }
  if (!moment(endDateResult).isValid()) { return Promise.reject(endDate) }

  var url = buildQuery(
    parseSymbols(symbols),
    parseMetrics(metrics),
    startDateResult,
    endDateResult
  );

  return xhrPromise.get(url)
    .then(function(res){
      if (res.body["query"]["results"]){
        var response = {
         results: _.groupBy(_.prop("Symbol"), res.body["query"]["results"]["quote"]),
         ResolutionTime: res.body["query"]["diagnostics"]["user-time"]
        }

        response = _.mergeAll([
          response,
          checkInvalidTickers(symbols, response),
          checkInvalidMetrics(metrics, response)
        ]);

        var sampleTicker = _.pipe(_.prop('results'), Object.keys, _.head)(response);
        var getSampleMetrics = _.pipe(_.prop('results'), _.prop(sampleTicker), _.head, Object.keys);

        if (_.equals(getSampleMetrics(response), ['Symbol', 'Date'])) { throw new Error(response.metricsError) }
        else { return response }
      } else {
        throw new Error(`No historical information found for ticker(s) ${symbols.join(", ")}`);
      }
    });
}

function parseSymbols(symbols) {
  if (!symbols) { return '"SPY"' }
  else if (_.type(symbols) === "String") { return '"' + symbols + '"' }
  else if (_.type(symbols) === "Array") { return JSON.stringify(symbols).slice(1, -1) }
}

function parseMetrics(metrics) {
  if (!metrics) { return  "*" }
  else if (_.type(metrics) === "String") { return metrics + ", Symbol"}
  else if (_.type(metrics) === "Array") { return metrics.concat(["Date", "Symbol"]).join(",") }
}

function parseStartDate(startDate){
  if (!startDate) { return moment().subtract(1, 'years').format("YYYY-MM-DD") }
  else {
    var startDate = moment(startDate);
    if (startDate.isValid()) { return startDate.format("YYYY-MM-DD"); }
    else { return `Start date ${startDate} is invalid. Please enter date in parseable format.`}
  }
}

function parseEndDate(endDate){
  if (!endDate) { return moment().format("YYYY-MM-DD") }
  else {
    var endDate = moment(endDate);
    if (endDate.isValid()) { return endDate.format("YYYY-MM-DD"); }
    else { return `End date ${endDate} is invalid. Please enter date in parseable format.`}
  }
}

function buildQuery(symbols, metrics, startDate, endDate){
  var rootPath = 'https://query.yahooapis.com/v1/public/yql?q=';
  var query = `select ${metrics} from yahoo.finance.historicaldata where symbol in (${symbols}) ` +
              `and startDate = "${startDate}" and endDate="${endDate}"`;
  var extraParams = '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
  return rootPath + encodeURIComponent(query) + extraParams;
}

function checkInvalidTickers(symbols, historicalData){
  if (!symbols) return {};
  if (_.type(symbols) !== "Array") { symbols = [symbols] }

  var validTickers = _.pipe(_.prop('results'), Object.keys)(historicalData);
  var isValid = _.contains(_.__, validTickers);
  var invalidSymbols = _.reject(isValid, symbols);
  var tickerError = `No historical information found for ticker(s) ${invalidSymbols.join(", ")}`
  return _.isEmpty(invalidSymbols) ? {} : { tickerError: tickerError };
}

function checkInvalidMetrics(metrics, historicalData){
  if (!metrics) return {};
  if (_.type(metrics) !== "Array") { metrics = [metrics] }

  var sampleTicker = _.pipe(_.prop('results'), Object.keys, _.head)(historicalData);
  var validMetrics = _.pipe(_.prop('results'), _.prop(sampleTicker), _.head, Object.keys)(historicalData);
  var isValid = _.contains(_.__, validMetrics);
  var invalidMetrics = _.reject(isValid, metrics);
  var metricsError = `No such metrics ${invalidMetrics.join(", ")}. Please refer to documentation for possible metrics.`;
  return _.isEmpty(invalidMetrics) ? {} : { metricsError: metricsError };
}

getStockDatawithOptions = _.curry(getStockData);

module.exports.getHistoricalData = getStockData;
module.exports.getAllData = getStockDatawithOptions(_.__, null, _.__, _.__);
module.exports.getLastYear = getStockDatawithOptions(_.__, null, null, null);
module.exports.getVolume = getStockDatawithOptions(_.__, "Volume");
module.exports.getHighLow = getStockDatawithOptions(_.__, ["High", "Low"]);
module.exports.getOpenClose = getStockDatawithOptions(_.__, ["Open", "Close"]);
module.exports.getAdjClose = getStockDatawithOptions(_.__, "Adj_Close");



