var express = require('express');
var router = express.Router();
var YFhistoricaldata = require('../queries/historicaldata.js');

router.get('/', function(req, res, next) {
  var response;

  var symbols = req.query.symbols.split(",")

  if (req.query.metrics) {
    metrics = decodeURIComponent(req.query.metrics).split(",");
    response = YFhistoricaldata.getHistoricalData(symbols, metrics, req.query.startDate, req.query.endDate);
  } else {
    response = YFhistoricaldata.getAllData(symbols, req.query.startDate, req.query.endDate);
  }

  res.json(response);
});


module.exports = router;