var request = require('request')
var through = require('through2')
var mongo = require('mongojs')
var db = mongo('test', ['stocks'])
 
// setInterval(function() {

// },30000);

request('http://localhost:3000/quotes?symbols=DIG%2CBBRY%2CWDC%2COIH%2CIVE%2CIBM%2CYELP%2CP%2CTWTR')
  .pipe(through(function(data){
    console.log(data);
    data = JSON.parse(data);
    data.map(function(stock){
      stock.timestamp = new Date();
    });
    db.stocks.insert(data);
    db.close();
    console.log("Data saved at", new Date().toString());
  }))