var _ = require('ramda');

function calculateStats(results, data) {
  var numPeriods = null;

  Object.keys(results).forEach(function(stock){
    if (!numPeriods) {
      numPeriods = data[stock].length;
    }
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

  return results;
}

module.exports = calculateStats;