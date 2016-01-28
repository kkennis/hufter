var needle = require('needle');

var get = function(url){
  return new Promise(function(resolve, reject){
    needle.get(url, function(err, res){
      if (err) { reject(err) }
      else { resolve(res) }
    })
  });
}

var post = function(url){
  return new Promise(function(resolve, reject){
    needle.post(url, data, function(err, res){
      if (err) { reject(err) }
      else { resolve(res) }
    })
  });
}

module.exports.get = get;
module.exports.post = post;

