var test = require('tape');
var xhr = require('needle');
var _ = require('ramda');
var moment = require('moment');
var host = `http://localhost:3000`;

var getLastDate = _.pipe(_.head, _.prop("Date"));
var getFirstDate = _.pipe(_.last, _.prop("Date"));
var getMetrics = _.pipe(_.head, Object.keys);

test('default historical information', function(t){
  t.plan(7);

  xhr.get(`${host}/historicaldata`, function(err, res){
    t.notOk(err, 'No error was received');
    var lastTrade, symbol, resTime;
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