var express = require('express');
var router = express.Router();
var YFhistoricaldata = require('../queries/historicaldata.js');
var _ = require('ramda');

router.get('/', function(req, res, next) {
  var request, symbols, metrics;
  var parseQuery = _.pipe(decodeURIComponent, _.split(","));
  if (req.query.symbols) { symbols = parseQuery(req.query.symbols) };

  if (req.query.metrics) {
    metrics = parseQuery(req.query.metrics);
    request = YFhistoricaldata.getHistoricalData(symbols, metrics, req.query.startDate, req.query.endDate)
  } else {
    request = YFhistoricaldata.getAllData(symbols, req.query.startDate, req.query.endDate)
  }

  request
    .then((response) => res.json(response))
    .catch((err) => res.status(400).json({ error: err }));
});


module.exports = router;