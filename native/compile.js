var fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var _ = require('ramda');

function compileAlgo(algo, data) {
  var fileName = 'native/test.cpp';
  var compiledFile = 'native/algo';

  return new Promise(function(resolve, reject){
    exec(`g++ -std=c++11 ${fileName} -o ${compiledFile}` , function(err, stdout, stderr){
      if (stderr) { reject(stderr) }
      var algoBin = spawn(`./${compiledFile}`);
      var body = '';

      algoBin.stdout.on('data', (chunk) => { console.log("Getting data..."); body += chunk })
      algoBin.on('close', function(exitCode){
        // fs.unlink(fileName);
        // fs.unlink(compiledFile);
        body = parseCPPReturn(body);
        resolve(body);
      })
      algoBin.on('error', (err) => reject(err))
      algoBin.stdin.write(JSON.stringify(data) + "\n");
    })
  });
}

function parseCPPReturn(data){
  data = _.pipe(_.trim, JSON.parse)(data);
  Object.keys(data).forEach(function(symbol){
    data[symbol]['signals']['buy'].forEach(function(signal){
      signal[1] = signal[1].toString();
    });
    data[symbol]['signals']['sell'].forEach(function(signal){
      signal[1] = signal[1].toString();
    });
  });
  return data;
}

module.exports = compileAlgo;