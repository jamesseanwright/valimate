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

	_exit(isInvalid, isCliRun, failHard, hasLocalAppServer) {
		if (hasLocalAppServer) {
			localAppServer.stop();
		}

		resultsPrinter.resetStdout();

		if (isCliRun) {
			const exitCode = isInvalid && failHard ? 1 : 0;
			process.exit(exitCode);
		}
	},

	validate(config, isCliRun) {
		// No destructing in Node.js 4 brah
		const appServerOptions = config.localAppServer;
		const failHard = config.failHard;

		intro();

		const prerun = appServerOptions
			? localAppServer.start(appServerOptions)
			: Promise.resolve();

		return prerun.then(runner)
			.then(results => resultsPrinter.printResults(results))
			.then(results => this._determineValidity(results))
			.then(isInvalid => isCliRun ? this._exit(isInvalid, true, failHard, !!appServerOptions) : isInvalid)
			.catch(e => {
				console.error(e);
				this._exit(true, isCliRun, failHard, !!appServerOptions);
			});
	}
};