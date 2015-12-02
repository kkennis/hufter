var test = require('tape');
var xhr = require('needle');
var co = require('co');
var host = 'http://localhost:3000';

test('default quote information', function(t){
  t.plan(4);


  xhr.get(`${host}/quotes`, function(err, res){
    var lastTrade, symbol, resTime;

    t.notOk(err, 'No error was received');

    if (res.body){
      lastTrade = res.body["LastTradePriceOnly"];
      symbol = res.body["Symbol"];
      resTime = res.body["ResolutionTime"];
    }

    t.equals(symbol, `SPY`, 'queries SPY ticker as default');
    t.ok(lastTrade, `retrieves information for last trade price`);
    t.ok(resTime, `gives resolution time of request`);
  })
})