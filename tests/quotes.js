var test = require('tape');
var xhr = require('needle');
var co = require('co');
var host = `http://localhost:3000`;

test('default quote information', function(t){
  t.plan(3);

  xhr.get(`${host}/quotes`, function(err, res){
    var lastTrade, symbol, resTime;

    t.notOk(err, 'No error was received');

    if (res.body){
      lastTrade = res.body["LastTradePriceOnly"];
      symbol = res.body["Symbol"];
    }

    t.equals(symbol, `SPY`, `queries SPY ticker as default`);
    t.ok(lastTrade, `retrieves information for last trade price`);
  })
});

test('default quote information with volume', function(t){
  t.plan(4);

  xhr.get(`${host}/quotes?volume=true`, function(err, res){
    var lastTrade, symbol, resTime;

    t.notOk(err, 'No error was received');

    if (res.body){
      lastTrade = res.body["LastTradePriceOnly"];
      symbol = res.body["Symbol"];
      volume = res.body["Volume"]
    }

    t.equals(symbol, `SPY`, `queries SPY ticker as default`);
    t.ok(lastTrade, `retrieves information for last trade price`);
    t.ok(volume, `retrieves information for volume`);
  })
});


test('custom metric information', function(t){
  t.plan(5);

  var queryString = "symbols=AAPL&metrics=LastTradePriceOnly%2CPercentChange%2CVolume";

  xhr.get(`${host}/quotes?${queryString}`, function(err, res){
    var lastTrade, symbol, resTime, volume, percentChange;

    t.notOk(err, 'No error was received');

    if (res.body){
      lastTrade = res.body["LastTradePriceOnly"];
      symbol = res.body["Symbol"];
      volume = res.body["Volume"];
      percentChange = res.body["PercentChange"];
    }

    t.equals(symbol, `AAPL`, `queries AAPL ticker when requested`);
    t.ok(lastTrade, `retrieves information for last trade price`);
    t.ok(volume, `retrieves information for volume`);
    t.ok(percentChange, `retrieves information for percent price change`);
  })
});

test ('multiple quote information', function(t){
  t.plan(14);

  var queryString = "symbols=SPY%2CAAPL%2CMSFT&metrics=LastTradePriceOnly%2CPercentChange%2CVolume";

  xhr.get(`${host}/quotes?${queryString}`, function(err, res){
    t.notOk(err, 'No error was received');

    t.equal(res.body.length, 3, 'The requested number of symbols were returned');

    res.body.forEach(function(data){
      var lastTrade = data["LastTradePriceOnly"];
      var symbol = data["Symbol"];
      var volume = data["Volume"];
      var percentChange = data["PercentChange"];

      t.ok(symbol, `returns symbol information for ${symbol}`);
      t.ok(lastTrade, `retrieves information for last trade price for ${symbol}`);
      t.ok(volume, `retrieves information for volume for ${symbol}`);
      t.ok(percentChange, `retrieves information for percent price change for ${symbol}`);
    });
  })
})