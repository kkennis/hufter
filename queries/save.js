var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');

var save = function(datum){

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function (callback) {
    var dataPoint = db.model('dataPoint')
    (new dataPoint(datum)).save(callback);
  });
  mongoose.disconnect();
}

module.exports = save;