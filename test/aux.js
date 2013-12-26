var assert = require('assert');
var Aux = require('../lib/aux');
var aux = new Aux({silent: true});

// Preliminary tests
aux.local('echo "TEST"', 'ls');
aux.local('ls /').stdout.pipe(process.stdout);

console.log('remote');
var test1 = new aux.Remote({host: 'test1.aux-remote'});
test1('ls', 'cat aux_test');
test1('echo "TESTING" > aux_test2');

var test2 = new aux.Remote({host: 'test2.aux-remote'});
test2('ls').stdout.pipe(test1('tee aux_test3').stdin);

if (process.argv[2] == 'remove') {
  test1('rm aux_test2', 'rm aux_test3');
}
