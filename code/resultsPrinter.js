'use strict';

const YELLOW = '\\033[33m';
const RED = '\\033[31m';
const BLUE = '\\033[31m';
const NORMAL = '\\033[0m';
const JOINER = '\n';

function map(item) {
	return item.message;
}

function mapWithDetails(item) {
	return `${item.message} - Line ${item.lastLine}, Column ${item.lastColumn}`;
}

function print(result) {
	console.log(`Results for ${result.url}:${JOINER}`);
	console.info(BLUE + result.info.map(map).join(JOINER));
	console.warn(YELLOW + result.warnings(mapWithDetails).join(JOINER));
	console.error(RED + result.errors.map(mapWithDetails).join(JOINER));

	console.log(NORMAL);
}

module.exports = function resultsPrinter(results) {
	for (let result of results) {
		print(result);
	}

	return results;
};