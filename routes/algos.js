var express = require('express');
var router = express.Router();
var YFhistoricaldata = require('../queries/historicaldata.js');
var backtester = require('../backtester/backtester.js')

router.post('/', function(req, res, next){
  var encryptedAlgo = req.body.data;
  // Decrypt algo and turn into function
  // Also check delta-t
  var stockData = YFhistoricaldata.getAllData(req.body.symbols, req.body.startDate, req.body.endDate)
  response = backtester(decryptedAlgo, stockData);
  res.json(response)
});