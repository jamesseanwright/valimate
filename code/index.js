'use strict';

const keepAlive = require('net').createServer().listen(10012);
const config = require('./config');
const intro = require('./intro');
const runner = require('./runner');
const localAppServer = require('./localAppServer');
const resultsPrinter = require('./resultsPrinter');

intro();

const prerun = config.localAppServer
	? localAppServer.start(config.localAppServer)
	: Promise.resolve();

prerun.then(runner)
	.then(results => resultsPrinter.printResults(results))
	.then(onValidated).catch(onError);

function onValidated(results) {
	const failed = hasErrors(results);

	if (!failed) {
		console.info('Congratulations! Your HTML is valid!');
		exit(0);
	} 

	exit(config.failHard ? 1 : 0);
}

function hasErrors(results) {
	return results.some(result => result.errors.length);
}

function onError(error) {
	console.error(error);
	exit(1);
}

function exit(exitCode) {
	if (config.localAppServer) {
		localAppServer.stop();
	}

	resultsPrinter.resetStdout();
	process.exit(exitCode);
}