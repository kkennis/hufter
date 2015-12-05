var express = require('express');
var router = express.Router();
var YFhistoricaldata = require('../queries/historicaldata.js');

router.get('/', function(req, res, next) {
  var response, symbols, metrics;

  if (req.query.symbols) symbols = decodeURIComponent(req.query.symbols).split(",");
  else symbols = null;

  if (req.query.metrics) {
    metrics = decodeURIComponent(req.query.metrics).split(",");
    YFhistoricaldata.getHistoricalData(symbols, metrics, req.query.startDate, req.query.endDate)
      .then((response) => res.json(response));
  } else {
    YFhistoricaldata.getAllData(symbols, req.query.startDate, req.query.endDate)
      .then((response) => res.json(response));;
  }

});


module.exports = router;