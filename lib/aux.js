var exec = require('child_process').exec;

var user = null;
module.exports = aux = function (settings) {
  if (settings && settings.user) user = settings.user;
};
aux.Remote = aux.Realm = Remote;
aux.local = new Remote();

function Remote() {
  var self = this;
  this.remotes = []; // local
  for (var i=0; i<arguments.length; i++) {
    this.remotes.push(arguments[i]);
  }
  return function handler() {
    for (var i=0; i<arguments.length; i++) {
      if (self.remotes.length == 0) exec(arguments[i]);
      else {
        self.remotes.forEach(function (remote) {
          var _user = remote.user || user;
          _user = _user ? _user + '@':'';
          exec('ssh ' + _user + remote.host + arguments[i]);
        });
      }
    }
  };
}
