var express = require('express');
var router = express.Router();
var YFhistoricaldata = require('../queries/historicaldata.js');

router.get('/', function(req, res, next) {
  var response, symbols, metrics;
  var parseQuery = _.pipe(decodeURIComponent, _.split(","));

  if (req.query.symbols) { symbols = parseQuery(req.query.symbols) };

  if (req.query.metrics) {
    metrics = parseQuery(req.query.metrics);
    YFhistoricaldata.getHistoricalData(symbols, metrics, req.query.startDate, req.query.endDate)
      .then((response) => res.json(response));
  } else {
    YFhistoricaldata.getAllData(symbols, req.query.startDate, req.query.endDate)
      .then((response) => res.json(response));;
  }

});


module.exports = router;