var test = require('tape');
var xhr = require('needle');
var host = `http://localhost:3000`;
var quotes = require('../routes/quotes.js');


test('default quote information', function(t){
  t.plan(3);

  xhr.get(`${host}/quotes`, function(err, res){
    t.notOk(err, 'No error was received');
    var lastTrade, symbol, resTime;
    var results = res.body["results"][0];


    if (results){
      lastTrade = results["LastTradePriceOnly"];
      symbol = results["Symbol"];
    }

    t.equal(symbol, `SPY`, `queries SPY ticker as default`);
    t.ok(lastTrade, `retrieves information for last trade price`);
  });
});

test('default quote information with volume', function(t){
  t.plan(4);

  xhr.get(`${host}/quotes?volume=true`, function(err, res){
    var lastTrade, symbol, resTime;
    var results = res.body["results"][0];

    t.notOk(err, 'No error was received');

    if (results){
      lastTrade = results["LastTradePriceOnly"];
      symbol = results["Symbol"];
      volume = results["Volume"]
    }

    t.equal(symbol, `SPY`, `queries SPY ticker as default`);
    t.ok(lastTrade, `retrieves information for last trade price`);
    t.ok(volume, `retrieves information for volume`);
  });
});

test('quote information with all data', function(t){
  t.plan(3);

  xhr.get(`${host}/quotes?symbols=AAPL&alldata=true`, function(err, res){
    var lastTrade, symbol, resTime;
    var results = res.body["results"][0];

    t.notOk(err, 'No error was received');
    t.equal(results["Symbol"], `AAPL`, `queries requested ticker`);
    t.equal(Object.keys(results).length, 83, `retrieves all 84 metrics`);

  })
});

test('custom metric information', function(t){
  t.plan(5);

  var queryString = "symbols=AAPL&metrics=LastTradePriceOnly%2CPercentChange%2CVolume";

  xhr.get(`${host}/quotes?${queryString}`, function(err, res){
    var lastTrade, symbol, resTime, volume, percentChange;
    var results = res.body["results"][0];

    t.notOk(err, 'No error was received');

    if (results){
      lastTrade = results["LastTradePriceOnly"];
      symbol = results["Symbol"];
      volume = results["Volume"];
      percentChange = results["PercentChange"];
    }

    t.equal(symbol, `AAPL`, `queries AAPL ticker when requested`);
    t.ok(lastTrade, `retrieves information for last trade price`);
    t.ok(volume, `retrieves information for volume`);
    t.ok(percentChange, `retrieves information for percent price change`);
  })
});

test('multiple quote information', function(t){
  t.plan(14);

  var queryString = "symbols=SPY%2CAAPL%2CMSFT&metrics=LastTradePriceOnly%2CPercentChange%2CVolume";

  xhr.get(`${host}/quotes?${queryString}`, function(err, res){
    var results = res.body["results"];

    t.notOk(err, 'No error was received');

    t.equal(results.length, 3, 'The requested number of symbols were returned');

    results.forEach(function(data){
      var lastTrade = data["LastTradePriceOnly"];
      var symbol = data["Symbol"];
      var volume = data["Volume"];
      var percentChange = data["PercentChange"];

      t.ok(symbol, `returns symbol information for ${symbol}`);
      t.ok(lastTrade, `retrieves information for last trade price for ${symbol}`);
      t.ok(volume, `retrieves information for volume for ${symbol}`);
      t.ok(percentChange, `retrieves information for percent price change for ${symbol}`);
    });
  });
});

test('invalid ticker response', function(t){
  t.plan(2);

  var queryString = "symbols=GOOOG";

  xhr.get(`${host}/quotes?${queryString}`, function(err, res){
    t.notOk(err, 'No error was received');
    t.equal(res.statusCode, 400, `returns 400 status code for an invalid ticker`);
  });
});

test('some invalid and some valid tickers', function(t){
  t.plan(3);

  var queryString = "symbols=SPY%2CAAAPL%2CMMSFT%2CTWTR&metrics=LastTradePriceOnly%2CPercentChange%2CVolume";

  xhr.get(`${host}/quotes?${queryString}`, function(err, res){
    t.notOk(err, 'No error was received');
    var results = res.body["results"];

    t.equal(results.length, 2, 'returns the right number of valid symbols');
    t.ok(res.body.tickerError, 'returns the right type of error')


  });
});

test('some invalid metrics', function(t){
  t.plan(3);

  var queryString = "symbols=SPY%2CAAPL%2CMSFT%2CTWTR&metrics=LastTrade%2CChange%2CVolume";

  xhr.get(`${host}/quotes?${queryString}`, function(err, res){
    t.notOk(err, 'No error was received');
    var results = res.body["results"];

    t.equal(results.length, 4, 'returns the right number of results');
    t.ok(res.body.metricsError, 'returns the right type of error')

  });
});

test('all invalid metrics', function(t){
  t.plan(2);

  var queryString = "symbols=SPY%2CAAPL%2CMSFT%2CTWTR&metrics=LastTrade%2CDange";

  xhr.get(`${host}/quotes?${queryString}`, function(err, res){
    t.notOk(err, 'No error was received');
    console.log(res.body)
    t.equal(res.statusCode, 400, `returns 400 status code for all invalid metrics`);
  });
});