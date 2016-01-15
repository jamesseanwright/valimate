'use strict';

const keepAlive = require('net').createServer().listen(10012);
const config = require(process.cwd() + '/valimate.json');
const runner = require('./runner');
const resultsPrinter = require('./resultsPrinter');

runner(config.urls)
	.then(resultsPrinter)
	.then(results => {
		process.exit(results.hasErrors ? 1 : 0);
	});