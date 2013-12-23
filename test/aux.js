var assert = require('assert');
var Aux = require('../lib/aux');
var aux = new Aux({silent: true});

aux.local('echo "TEST"', 'ls');
aux.local('ls /').stdout.pipe(process.stdout);

