'use strict';

const YELLOW = '\x1b[1;33m';
const RED = '\x1b[1;31m';
const BLUE = '\x1b[1;34m';
const WHITE = '\x1b[1;37m'
const NORMAL = '\x1b[0m';
const JOINER = '\n';
const BULLET = '*'

function map(item) {
	return `${BULLET} ${item.message}`;
}

function mapWithDetails(item) {
	return `${BULLET} ${item.message} - Line ${item.lastLine}, Column ${item.lastColumn}`;
}

function print(result) {
	const warnings = result.warnings;
	const errors = result.errors;

	console.log(`${WHITE}Results for ${result.url}:`);
	console.log(`${warnings.length} warnings, ${errors.length} errors${JOINER}`);

	console.log(BLUE + result.info.map(map).join(JOINER));

	if (warnings.length) {
		console.log(YELLOW + warnings.map(mapWithDetails).join(JOINER));
	}

	if (errors.length) {
		console.log(RED + result.errors.map(mapWithDetails).join(JOINER));
	}

	console.log(NORMAL + JOINER);
}

module.exports = function resultsPrinter(results) {
	for (let result of results) {
		print(result);
	}

	return Promise.resolve(results);
};