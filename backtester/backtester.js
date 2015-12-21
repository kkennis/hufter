var YFhistoricaldata = require('../queries/historicaldata.js');
var testAlgo = require('../testalgo.js')
var _ = require('ramda');


function runBacktest(algo, data){

  var results = {};
  var numPeriods = null;
  var sum = _.reduce(_.add, 0);

  var stocks = data["results"];

  Object.keys(stocks).forEach(function(stock){

    results[stock] = {};

    var stockData = stocks[stock];
    if (!numPeriods) numPeriods = stockData.length;
    var formattedData = _.map((quote) => [quote["Date"], quote["Close"]], stockData)


    results[stock]["signals"] = algo(formattedData);

    var getSignals = (signal) => results[stock]["signals"][signal];
    var parseSignals = _.pipe(getSignals, _.map(_.pipe(_.last, parseFloat)));

    var buySignals = parseSignals("buy");
    var totalBought = sum(buySignals);

    var sellSignals = parseSignals("sell");
    var totalSold = sum(sellSignals);

    results[stock]["TotalBought"] = totalBought;
    results[stock]["TotalSold"] = totalSold;
    results[stock]["ROI"] = (totalSold - totalBought) / totalBought;
    results[stock]["GrossReturn"] = totalSold - totalBought;

    var getVolume = (stock) => stock["Volume"];
    var sumVolume = _.pipe(_.map(_.pipe(getVolume, parseInt)), sum)
    var totalVolume = sumVolume(stockData)

    results[stock]["TotalVolume"] = totalVolume;
    results[stock]["AverageDailyVolume"] = totalVolume / stockData.length;

    results[stock]["TotalBuys"] = buySignals.length;
    results[stock]["TotalSells"] = sellSignals.length;
    results[stock]["BuysPerPeriod"] = buySignals.length / numPeriods;
    results[stock]["SellsPerPeriod"] = sellSignals.length / numPeriods;

    results[stock]["TotalTrades"] = buySignals.length + sellSignals.length;


  });

  var overallStats = {};

  var getStock = (stock) => results[stock];
  var getMetric = _.curry((metric, quote) => quote[metric]);

  var getTotal = (metric) => _.pipe(_.map(_.pipe(getStock, getMetric(metric))), sum)(Object.keys(results));

  var overallBought = getTotal("TotalBought")
  var overallSold = getTotal("TotalSold")


  overallStats["TotalBought"] = overallBought;
  overallStats["TotalSold"] = overallSold;
  overallStats["ROI"] = (overallSold - overallBought) / overallBought;
  overallStats["GrossReturn"] = overallSold - overallBought;

  var overallVolume = getTotal("TotalVolume");

  overallStats["TotalVolume"] = overallVolume
  overallStats["AverageDailyVolume"] = overallVolume / Object.keys(results).length;

  overallStats["TotalBuys"] = getTotal("TotalBuys")
  overallStats["TotalSells"] = getTotal("TotalSells")

  overallStats["BuysPerPeriod"] = getTotal("BuysPerPeriod")
  overallStats["SellsPerPeriod"] = getTotal("SellsPerPeriod")

  overallStats["TotalTrades"] = overallStats["TotalBuys"] + overallStats["TotalSells"];

  results["TotalStats"] = overallStats;

  return results;


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

