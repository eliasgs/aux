var Transform = require('stream').Transform;
var fs = require('fs');

var path = process.env.HOME + '/.ssh/authorized_keys';
var authorized_keys = fs.createWriteStream(path, {flags: 'a'}); // append

exports.addKey = function (user) {
  if (!user) throw new Error('Please provide a valid user name');

  var prependOptions = new Transform();
  prependOptions._transform = function (chunk, enc, callback) {
   var options = [
     'command="aux --user ' + user + ' --proxy $SSH_ORIGINAL_COMMAND"',
     ',no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty '
   ].join('');
   var key = chunk.toString();
   this.push(options + key);
   callback();
  };

  process.stdin.pipe(prependOptions).pipe(authorized_keys);
};
exports.removeKeys = function (user) {
};
exports.addCommand = function (user) {
}; 
exports.removeCommand = function (user) {
}; 
