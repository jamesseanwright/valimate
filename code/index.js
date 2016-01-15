'use strict';

const keepAlive = require('net').createServer().listen(10012);
const config = require(process.cwd() + '/valimate.json');
const runner = require('./runner');
const resultsPrinter = require('./resultsPrinter');

const zeroExitCodeOnFail = typeof config.zeroExitCodeOnFail !== 'undefined'
		? config.zeroExitCodeOnFail : true;

runner(config.urls)
	.then(resultsPrinter)
	.then(results => {
		process.exit(hasErrors(results) ? 1 : 0);
	});

function hasErrors(results) {
	return results.some(result => result.errors.length);
}