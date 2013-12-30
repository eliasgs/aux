var exec = require('child_process').exec;
var duplex = require('duplexer');

var aux = {};

module.exports = aux;


aux.remote = remote;
aux.realm = realm;
aux.local = remote();

function remote(options) {
  options = options || {};
  if (options.host && options.user) {
    options.host = options.user + '@' + options.host;
  }
  function handler() {
    var args = Array.prototype.slice.call(arguments);
    var cmd = args.join('&&');
    if (options.host) {
      cmd = 'ssh ' + options.host + ' "' + cmd + '"';
    }
    var result = exec(cmd, function (err, stdout, stderr) {
      if (options.verbose) {
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
        if (err) process.exit(err.code);
      }
    });
    var stream = duplex(result.stdin, result.stdout);
    stream.stdout = result.stdout;
    stream.stdin = result.stdin;
    stream.stderr = result.stderr;
    return stream;
  }
  handler.options = options;
  return handler;
}

function realm() {
  var remotes = [];
  for (var i=0; i<arguments.length; i++) {
    remotes.push(remote(arguments[i]));
  }
  return function handler() {
    var _arguments = arguments;
    remotes.forEach(function (remoteHandler) {
      remoteHandler.options.verbose = true;
      remoteHandler.apply(this, _arguments);
    });
  };
}
