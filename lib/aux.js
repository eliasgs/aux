var exec = require('child_process').exec;
var util = require('util');

module.exports = Aux;

function Aux(settings) {
  this.Remote = Remote;
  this.local = new Remote(settings);
}

function Remote(settings) {
  var self = this;
  self.settings = settings || {};
  return function handler() {
    var args = Array.prototype.slice.call(arguments);
    var cmd = args.join('&&');
    if (self.settings && self.settings.host) {
      cmd = 'ssh ' + self.settings.host + ' "' + cmd + '"';
    }
    var result = exec(cmd, function (err, stdout, stderr) {
      if (self.settings && !self.settings.silent) {
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
        if (err) process.exit(err.code);
      }
    });
    return result;
  };
}
