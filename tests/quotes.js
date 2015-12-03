var test = require('tape');
var xhr = require('needle');
var co = require('co');
var host = `http://localhost:3000`;

test('default quote information', function(t){
  t.plan(3);

  xhr.get(`${host}/quotes`, function(err, res){
    var lastTrade, symbol, resTime;
    var results = res.body["results"];

    t.notOk(err, 'No error was received');

    if (results){
      lastTrade = results["LastTradePriceOnly"];
      symbol = results["Symbol"];
    }

    t.equals(symbol, `SPY`, `queries SPY ticker as default`);
    t.ok(lastTrade, `retrieves information for last trade price`);
  })
});

test('default quote information with volume', function(t){
  t.plan(4);

  xhr.get(`${host}/quotes?volume=true`, function(err, res){
    var lastTrade, symbol, resTime;
    var results = res.body["results"];

    t.notOk(err, 'No error was received');

    if (results){
      lastTrade = results["LastTradePriceOnly"];
      symbol = results["Symbol"];
      volume = results["Volume"]
    }

    t.equals(symbol, `SPY`, `queries SPY ticker as default`);
    t.ok(lastTrade, `retrieves information for last trade price`);
    t.ok(volume, `retrieves information for volume`);
  })
});

test('quote information with all data', function(t){
  t.plan(3);

  xhr.get(`${host}/quotes?symbols=AAPL&alldata=true`, function(err, res){
    var lastTrade, symbol, resTime;
    var results = res.body["results"];

    t.notOk(err, 'No error was received');
    t.equals(results["Symbol"], `AAPL`, `queries requested ticker`);
    t.equals(Object.keys(results).length, 83, `retrieves all 84 metrics`);

  })
});

test('custom metric information', function(t){
  t.plan(5);

  var queryString = "symbols=AAPL&metrics=LastTradePriceOnly%2CPercentChange%2CVolume";

  xhr.get(`${host}/quotes?${queryString}`, function(err, res){
    var lastTrade, symbol, resTime, volume, percentChange;
    var results = res.body["results"];

    t.notOk(err, 'No error was received');

    if (results){
      lastTrade = results["LastTradePriceOnly"];
      symbol = results["Symbol"];
      volume = results["Volume"];
      percentChange = results["PercentChange"];
    }

    t.equals(symbol, `AAPL`, `queries AAPL ticker when requested`);
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
  t.plan(1);

  var queryString = "symbols=GOOOG";

  xhr.get(`${host}/quotes?${queryString}`, function(err, res){
    t.equal(res.statusCode, 400, `returns 400 status code for an invalid ticker`);
  });
})