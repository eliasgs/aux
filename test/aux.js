var assert = require('assert');
var aux = require('../lib/aux');

aux({silent: true}).local('echo "TEST"', 'ls');
aux.local('ls /').stdout.pipe(process.stdout);

