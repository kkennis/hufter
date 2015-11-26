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

// Functional mongo calls

function getTickers(){
  return Ticker
    .find({})
    .exec()
    .then((tickers) => _.pluck('name', tickers))
    .then(uniq);
    // .then((symbols) => YFquotes.getLastTrade(symbols))
    // .then((response) => saveToMongo(response));
}

// function saveToMongo(data){

// }


// var getTickers = Ticker.find({},function(err, tickers){
//   var symbols = tickers.map(function(ticker){
//     return ticker["name"];
//   })

//   new Promise(function(resolve, reject){
//     response = YFquotes.getLastTrade(uniq(symbols));
//     resolve(response);
//   })
//   .then(function(response){
//     if (Object.keys(response).length !== 0){
//       saveToMongo(response);
//       res.end("Data saved at " + new Date().toString());
//     } else {
//       res.send(response);
//       res.end("Yahoo API Error")
//     }
//   })
// });

module.exports = getTickers;