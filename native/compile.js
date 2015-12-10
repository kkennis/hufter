var fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var execStream = require('exec-stream')

function compileAlgo(algo, data) {
  var fileName = 'native/test.cpp';
  var compiledFile = "native/test_program";

  return new Promise(function(resolve, reject){
    exec(`g++ -std=c++11 ${fileName} -o ${compiledFile}`, function(err, stdout, stderr){
      if (stderr) { reject(stderr) }
      var run = spawn(`./${compiledFile}`)
      var body = ''
      run.stdout.on('data', function(chunk){
        body += chunk;
      });
      run.on('close', function(exitCode){
        // Body is string - maybe objectify!
        resolve(body);
      })
      run.on('error', function(err){
        reject(err);
      });
      run.stdin.write(JSON.stringify(data) + "\n");
    })
  });
}

module.exports = compileAlgo;