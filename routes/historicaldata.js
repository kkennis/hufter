var express = require('express');
var router = express.Router();
var YFhistoricaldata = require('../queries/historicaldata.js');

router.get('/', function(req, res, next) {
  var response;

  if (req.query.metrics) {
    metrics = decodeURIComponent(req.query.metrics).split(",");
    response = YFhistoricaldata.getHistoricalData(req.query.symbols, metrics, req.query.startDate, req.query.endDate);
  } else {
    response = YFhistoricaldata.getAllData(req.query.symbols, req.query.startDate, req.query.endDate);
  }

  res.json(response);
});


module.exports = router;