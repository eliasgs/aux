var exec = require('child_process').exec;

module.exports = Aux;

function Aux(settings) {
  this.Remote = Remote;
  this.local = new Remote(settings);
}

function Remote(settings) {
  var self = this;
  self.settings = settings || {};
  if (self.settings.host && self.settings.user) {
    self.settings.host = self.settings.user + '@' + self.settings.host;
  }
  return function handler() {
    var args = Array.prototype.slice.call(arguments);
    var cmd = args.join('&&');
    if (self.settings.host) {
      cmd = 'ssh ' + self.settings.host + ' "' + cmd + '"';
    }
    var result = exec(cmd, function (err, stdout, stderr) {
      if (!self.settings.silent) {
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
        if (err) process.exit(err.code);
      }
    });
    return result;
  };
}
