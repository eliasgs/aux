var exec = require('child_process').exec;

module.exports = aux = function (settings) {
  if (settings) aux.settings = settings;
  return aux;
};
aux.Remote = Remote;
aux.local = new Remote();

function Remote() {
  var self = this;
  return function handler() {
    var args = Array.prototype.slice.call(arguments);
    var cmd = args.join('&&');
    var result = exec(cmd, function (err, stdout, stderr) {
      if (aux.settings && !aux.settings.silent) {
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
        if (err) process.exit(err.code);
      }
    });
    return result;
  };
}
