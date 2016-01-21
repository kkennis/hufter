var _ = require('ramda');

function calculateVWAP(data, numPeriods){

  var results = {};
  var sum = _.reduce(_.add, 0);
  var stocks = data["results"];

  Object.keys(stocks).forEach(function(stock){
    var getPeriods = _.takeLast(numPeriods);
    var stockData = getPeriods(stocks[stock]);

    var getAvgPrice = _.reduce((accum, day) => accum + parseInt(day['Close'], 10) * parseInt(day['Volume'], 10), 0);
    var getTotalVolume = _.reduce((accum, day) => accum + parseInt(day['Volume'], 10), 0);
    var divideByVolume = _.flip(_.divide)(getTotalVolume(stockData));
    var getValues = _.pipe(getAvgPrice, divideByVolume);

    results[stock] = getValues(stockData);
  });

  return results;
}

module.exports = calculateVWAP;