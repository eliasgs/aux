var assert = require('assert');
var Aux = require('../lib/aux');
var aux = new Aux({silent: true});

aux.local('echo "TEST"', 'ls');
aux.local('ls /').stdout.pipe(process.stdout);

console.log('remote');
var test = aux.Remote({host: 'test.nosco'});
test('ls', 'cat aux_test');
test('echo "TESTING" > aux_test2');

