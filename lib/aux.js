var spawn = require('child_process').spawn;
var duplex = require('duplexer');

var aux = {};

module.exports = aux;


aux.remote = remote;
aux.realm = realm;
aux.local = remote();

function remote(options) {
  options = options || {};
  var ignore = ['host', 'verbose'];
  var _args = [];
  if (!options.host) options.host = '127.0.0.1';
  if (options.user) {
    options.l = options.user;
    delete options.user;
  }
  for (var _opt in options) {
    if (ignore.indexOf(_opt) == -1 && options.hasOwnProperty(_opt)) {
      _args.push('-' + _opt);
      _args.push('' + options[_opt]);
    }
  }
  _args.push(options.host);
  function handler() {
    var args = Array.prototype.slice.call(arguments);
    var callback;
    if (typeof args[args.length-1] == 'function') {
      callback = args.pop();
    }

    var cmd = args.join('&&');
    _args.push(cmd);
    var result = spawn('ssh', _args, function (err, stdout, stderr) {
      if (options.verbose) {
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
        if (err) process.exit(err.code);
      }
      if (callback) callback(err, stdout);
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
