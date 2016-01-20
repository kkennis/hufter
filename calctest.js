var xhr = require('./utils/needle-promisify.js');
var vwap = require('./backtester/vwap.js');

xhr.get('http://localhost:3000/historicaldata')
  .then(function(res){
    // console.log(stockData)
    var results = vwap(res.body, 5);

    console.log(results);
  })
