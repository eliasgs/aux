var exec = require('child_process').exec;
var Duplex = require('stream').Duplex;
var util = require('util');


module.exports = Aux;

function Aux(options) {
  this.Remote = Remote;
  this.local = new Remote(options);
}

util.inherits(Remote, Duplex);
function Remote(options) {
  var self = this;
  Duplex.call(self, options);
  self.options = options || {};
  if (self.options.host && self.options.user) {
    self.options.host = self.options.user + '@' + self.options.host;
  }
  function handler() {
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
    self.stdout = result.stdout;
    self.stdin = result.stdin;
    self.stderr = result.stderr;

    // this doesn't work - it seems as if the result streams are still
    // implemented with the stream1 api - I could also simply missing some
    // detail!
    self._read = result.stdout._read;
    self._write = result.stdin._write;
    return self;
  }
  handler.__proto__ = self.__proto__;
  return handler;
}
