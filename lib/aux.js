var exec = require('child_process').exec;
var duplex = require('duplexer');


module.exports = Aux;

function Aux(options) {
  this.Remote = Remote;
  this.local = new Remote(options);
}

function Remote(options) {
  var self = this;
  self.options = options || {};
  if (self.options.host && self.options.user) {
    self.options.host = self.options.user + '@' + self.options.host;
  }
  return function handler() {
    var args = Array.prototype.slice.call(arguments);
    var cmd = args.join('&&');
    if (self.options.host) {
      cmd = 'ssh ' + self.options.host + ' "' + cmd + '"';
    }
    var result = exec(cmd, function (err, stdout, stderr) {
      if (!self.options.silent) {
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
  };
}
