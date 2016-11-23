'use strict';

const intro = require('./intro');
const runner = require('./runner');
const localAppServer = require('./localAppServer');
const resultsPrinter = require('./resultsPrinter');

function onValidated(results) {
	const hasFailed = hasErrors(results);

	if (!hasFailed) {
		console.info('Congratulations! Your HTML is valid!');
	}

	return hasFailed;
}

function hasErrors(results) {
	return results.some(result => result.errors.length);
}

function onError(error) {
	console.error(error);
	exit(true);
}

function exit(hasFailed, config) {
	const exitCode = hasFailed && config.failHard ? 1 : 0;

	if (config.localAppServer) {
		localAppServer.stop();
	}

	resultsPrinter.resetStdout();
	process.exit(exitCode);
}

module.exports = function valimate(config) {
	intro();

	const prerun = config.localAppServer
		? localAppServer.start(config.localAppServer)
		: Promise.resolve();

	return prerun.then(runner)
		.then(results => resultsPrinter.printResults(results))
		.then(onValidated)
		.then(hasFailed => exit(hasFailed, config))
		.catch(() => onError(true, config));
};