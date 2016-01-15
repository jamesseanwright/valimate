'use strict';

const keepAlive = require('net').createServer().listen(10012);
const config = require('./config');
const runner = require('./runner');
const resultsPrinter = require('./resultsPrinter');

runner(config.urls)
	.then(resultsPrinter)
	.then(results => {
		process.exit(hasErrors(results) && config.failHard ? 1 : 0);
	});

function hasErrors(results) {
	return results.some(result => result.errors.length);
}