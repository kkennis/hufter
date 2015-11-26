var mongoose = require('mongoose');
var moment = require('moment');
var tz = require('moment-timezone');
var range = require('moment-range');
var YFquotes = require('../queries/quotes');
var _ = require('ramda');
var uniq = require('uniq');

var db = mongoose.connection;
var host = process.env["DB_HOST"]

var tickerSchema = mongoose.Schema({ name: String });
var Ticker = mongoose.model('Ticker', tickerSchema);

function getTickers(){
  return Ticker
    .find({})
    .exec()
    .then((tickers) => _.pluck('name', tickers))
    .then(uniq);
}

module.exports = getTickers;