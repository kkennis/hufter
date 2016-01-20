var _ = require('ramda');

function calculateVWAP(data, numPeriods){
  var results = {};
  var sum = _.reduce(_.add, 0);
  var stocks = data["results"];

  Object.keys(stocks).forEach(function(stock){
    var getPeriods = _.takeLast(numPeriods);
    var getAvgPrice = _.reduce((accum, day) => accum + day['Close'] * day['Volume'], 0);
    var getTotalVolume = _.reduce((accum, day) => accum + day['Volume'], 0);
    var divideByVolume = _.flip(_.divide)(getTotalVolume(stock));
    var log = (data) => { console.log(data); return data; }
    // var dataWeWant = _.pipe(getPeriods, _.pluck('Volume'), parseInt, sum)(stocks[stock]);
    // console.log(dataWeWant);
    var getValues = _.pipe(getPeriods, getAvgPrice, divideByVolume);

    results[stock] = getValues(stocks[stock]);
  });

  return results;
}

module.exports = calculateVWAP;