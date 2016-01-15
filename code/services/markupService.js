'use strict';

const httpService = require('./httpService');

const HOST_REGEX = /^http(s?)\:\/\/(.*)\//i;
const PATH_DELIMITER = '/';
const INVALID_HOST = 'The url {url} is invalid!';

function extractHost(url) {
	const matches = url.match(HOST_REGEX);

	if (!matches) {
		throw new Error(INVALID_HOST.replace('{url}', url));
	}

	const match = matches[0];

	return match.substring(0, match.length - 1);
}

function extractPath(url) {
	const host = extractHost(url);
	return url.substring(host.length, url.length);
}

module.exports = {
	get(url) {
		return httpService.get({
			host: extractHost(url),
			path: extractPath(url)
		});
	}
};