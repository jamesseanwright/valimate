'use strict';

const YELLOW = '\x1b[1;33m';
const RED = '\x1b[1;31m';
const BLUE = '\x1b[1;34m';
const WHITE = '\x1b[1;37m'
const NORMAL = '\x1b[0m';
const JOINER = '\n';
const BULLET = '*'

module.exports = {
	resetStdout() {
		console.log(NORMAL);
	},

	printResults(results) {
		for (let result of results) {
			this._print(result);
		}

		return Promise.resolve(results);
	},

	_print(result) {
		const warnings = result.warnings;
		const errors = result.errors;

		console.log(`${WHITE}Results for ${result.url}:`);
		console.log(`${warnings.length} warnings, ${errors.length} errors${JOINER}`);

		console.log(BLUE + result.info.map(info => this._map(info)).join(JOINER));

		if (warnings.length) {
			console.log(YELLOW + warnings.map(warning => this._mapWithDetails(warning)).join(JOINER));
		}

		if (errors.length) {
			console.log(RED + result.errors.map(error => this._mapWithDetails(error)).join(JOINER));
		}

		console.log(NORMAL + JOINER);
	},

	_map(item) {
		return `${BULLET} ${item.message}`;
	},

	_mapWithDetails(item) {
		return `${this._map(item)} - Line ${item.lastLine}, Column ${item.lastColumn}`;
	}
}