'use strict';

const intro = require('./intro');
const runner = require('./runner');
const localAppServer = require('./localAppServer');
const resultsPrinter = require('./resultsPrinter');

module.exports = {
	_determineValidity(results) {
		const isInvalid = this._hasErrors(results);

		if (!isInvalid) {
			console.info('Congratulations! Your HTML is valid!');
		}

		return isInvalid;
	},

	_hasErrors(results) {
		return results.some(result => result.errors.length);
	},

	_onError(error, isCliRun) {
		console.error(error);

		if (isCliRun) {
			this._exit(true);
		}
	},

	_exit(isInvalid, config) {
		const exitCode = isInvalid && config.failHard ? 1 : 0;

		if (config.localAppServer) {
			localAppServer.stop();
		}

		resultsPrinter.resetStdout();
		process.exit(exitCode);
	},

	validate(config, isCliRun) {
		intro();

		const prerun = config.localAppServer
			? localAppServer.start(config.localAppServer)
			: Promise.resolve();

		return prerun.then(runner)
			.then(results => resultsPrinter.printResults(results))
			.then(results => this._determineValidity(results))
			.then(isInvalid => isCliRun ? this._exit(isInvalid, config) : isInvalid)
			.catch(e => this._onError(e, isCliRun));
	}
};