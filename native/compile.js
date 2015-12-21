var fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

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
        console.log("Connection closed");
        console.log(body);
        resolve(body);
      })
      algoBin.on('error', (err) => reject(err))
      algoBin.stdin.write(JSON.stringify(data) + "\n");
    })
  });
}

module.exports = compileAlgo;