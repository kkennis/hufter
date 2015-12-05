var test = require('tape');
var xhr = require('needle');
var _ = require('ramda');
var moment = require('moment');
require('moment-timezone');
require('moment-range')
var host = `http://localhost:3000`;
var historicaldata = require('../routes/historicaldata.js');


var getLastDate = _.pipe(_.head, _.prop("Date"));
var getFirstDate = _.pipe(_.last, _.prop("Date"));
var getMetrics = _.pipe(_.head, Object.keys);

test('default historical information', function(t){
  t.plan(7);

  xhr.get(`${host}/historicaldata`, function(err, res){
    t.notOk(err, 'No error was received');
    var results = res.body["results"];

    t.notOk(_.isEmpty(results), `returns results for query`);
    t.ok(results["SPY"], `returns SPY information as default`);


    var oneDayAgo = moment().subtract(1, 'days');
    var oneYearAgo = moment().subtract(1, 'years');

    t.equal(getLastDate(results["SPY"]), oneDayAgo.format('YYYY-MM-DD'), `defaults to gathering data until present day` );
    t.equal(getFirstDate(results["SPY"]), oneYearAgo.format('YYYY-MM-DD'), `defaults to gathering data starting one year ago` );
    t.equal(results["SPY"].length, 252, `returns correct number of trading days per year`);
    t.deepEqual(getMetrics(results["SPY"]), ["Symbol", "Date", "Open", "High", "Low", "Close", "Volume", "Adj_Close"], `returns correct metrics`);

  });
});

test('multiple symbol historical information', function(t){
  t.plan(11);

  var queryString = "symbols=AAPL%2CMSFT"

  xhr.get(`${host}/historicaldata?${queryString}`, function(err, res){
    t.notOk(err, 'No error was received');
    var results = res.body["results"];

    t.notOk(_.isEmpty(results), `returns results for query`);
    t.deepEqual(Object.keys(results), ["AAPL", "MSFT"], `returns requested ticker information`);

    var oneDayAgo = moment().subtract(1, 'days');
    var oneYearAgo = moment().subtract(1, 'years');

    Object.keys(results).forEach(function(ticker){
      var result = results[ticker];

      t.equal(getLastDate(result), oneDayAgo.format('YYYY-MM-DD'), `defaults to gathering data until present day for ${ticker}` );
      t.equal(getFirstDate(result), oneYearAgo.format('YYYY-MM-DD'), `defaults to gathering data starting one year ago  for ${ticker}` );
      t.equal(result.length, 252, `returns correct number of trading days per year  for ${ticker}`);
      t.deepEqual(getMetrics(result), ["Symbol", "Date", "Open", "High", "Low", "Close", "Volume", "Adj_Close"], `returns correct metrics  for ${ticker}`);
    });

  });
});

test('custom date range information', function(t){
  t.plan(7);

  var queryString = "startDate=2014-08-01&endDate=2014-08-31"

  xhr.get(`${host}/historicaldata?${queryString}`, function(err, res){
    t.notOk(err, 'No error was received');
    var results = res.body["results"];

    t.notOk(_.isEmpty(results), `returns results for query`);
    t.ok(results["SPY"], `returns SPY information as default`);

    var oneDayAgo = moment().subtract(1, 'days');
    var oneYearAgo = moment().subtract(1, 'years');

    t.equal(getLastDate(results["SPY"]), "2014-08-29", `gathers data until requested end date (or nearest business day)` );
    t.equal(getFirstDate(results["SPY"]), "2014-08-01", `gathers data from requested start date (or nearest business day)` );
    t.equal(results["SPY"].length, 21, `returns correct number of trading days in August 2014`);
    t.deepEqual(getMetrics(results["SPY"]), ["Symbol", "Date", "Open", "High", "Low", "Close", "Volume", "Adj_Close"], `returns correct metrics`);

  });
});

test('custom metric information', function(t){
  t.plan(7);

  var queryString = "startDate=2014-08-01&endDate=2014-08-31&metrics=Open%2CClose"

  xhr.get(`${host}/historicaldata?${queryString}`, function(err, res){
    t.notOk(err, 'No error was received');
    var results = res.body["results"];

    t.notOk(_.isEmpty(results), `returns results for query`);
    t.ok(results["SPY"], `returns SPY information as default`);

    var oneDayAgo = moment().subtract(1, 'days');
    var oneYearAgo = moment().subtract(1, 'years');

    t.equal(getLastDate(results["SPY"]), "2014-08-29", `gathers data until requested end date (or nearest business day)` );
    t.equal(getFirstDate(results["SPY"]), "2014-08-01", `gathers data from requested start date (or nearest business day)` );
    t.equal(results["SPY"].length, 21, `returns correct number of trading days in August 2014`);
    t.deepEqual(getMetrics(results["SPY"]), ["Symbol", "Open", "Close", "Date"], `returns correct metrics`);

  });
});

test('invalid ticker response', function(t){
  t.plan(2);

  var queryString = "symbols=GOOOG";

  xhr.get(`${host}/historicaldata?${queryString}`, function(err, res){
    t.notOk(err, 'No error was received');
    t.equal(res.statusCode, 400, `returns 400 status code for an invalid ticker`);
  });
});

test('some invalid and some valid tickers', function(t){
  t.plan(3);

  var queryString = "symbols=SPY%2CAAAPL%2CMMSFT%2CTWTR&metrics=LastTradePriceOnly%2CPercentChange%2CVolume";

  xhr.get(`${host}/historicaldata?${queryString}`, function(err, res){
    t.notOk(err, 'No error was received');
    var results = res.body["results"];

    t.equal(Object.keys(results).length, 2, 'returns the right number of valid symbols');
    t.ok(res.body.tickerError, 'returns the right type of error');
  });
});

test('some invalid metrics', function(t){
  t.plan(3);

  var queryString = "symbols=AAPL%2CMSFT&metrics=Open%2CClose%2CTop";

  xhr.get(`${host}/historicaldata?${queryString}`, function(err, res){
    t.notOk(err, 'No error was received');
    var results = res.body["results"];

    t.equal(Object.keys(results).length, 2, 'returns the right number of results');
    t.ok(res.body.metricsError, 'returns the right type of error')

  });
});

test('all invalid metrics', function(t){
  t.plan(2);

  var queryString = "symbols=SPY%2CAAPL%2CMSFT%2CTWTR&metrics=Top%2CBottom";

  xhr.get(`${host}/quotes?${queryString}`, function(err, res){
    t.notOk(err, 'No error was received');
    t.equal(res.statusCode, 400, `returns 400 status code for all invalid metrics`);
  });
});

test('invalid start date', function(t){
  t.plan(2);

  var queryString = "symbols=SPY%2CAAPL%2CMSFT%2CTWTR&metrics=Top%2CBottom&startDate=sometime";

  xhr.get(`${host}/quotes?${queryString}`, function(err, res){
    t.notOk(err, 'No error was received');
    t.equal(res.statusCode, 400, `returns 400 status code for invalid start date`);
  });
});

test('invalid end date', function(t){
  t.plan(2);

  var queryString = "symbols=SPY%2CAAPL%2CMSFT%2CTWTR&metrics=Top%2CBottom&endDate=sometime";

  xhr.get(`${host}/quotes?${queryString}`, function(err, res){
    t.notOk(err, 'No error was received');
    t.equal(res.statusCode, 400, `returns 400 status code for invalid end date`);
  });
});