var assert = require('assert');
var Aux = require('../lib/aux');
var aux = new Aux({silent: true});

// Preliminary tests
aux.local('echo "TEST"', 'ls');
aux.local('ls /').stdout.pipe(process.stdout);

console.log('remote');
var test = aux.Remote({host: 'test.aux-remote'});
test('ls', 'cat aux_test');
test('echo "TESTING" > aux_test2');

if (process.argv[2] == 'remove') {
  test('rm aux_test2');
}
