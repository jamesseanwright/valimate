'use strict';

const httpService = require('./httpService');

const HOST_REGEX = /^http(s?)\:\/\/(.*)\.[a-z\.]{2,6}\//i;
const PATH_DELIMITER = '/';
const INVALID_HOST = 'The url {url} is invalid!';

module.exports = {
	get(url) {
		return httpService.get({
			host: this._extractHost(url),
			path: this._extractPath(url)
		});
	},

	_extractHost(url) {
		const matches = url.match(HOST_REGEX);

		if (!matches) {
			throw new Error(INVALID_HOST.replace('{url}', url));
		}

		const match = matches[0];

		return match.substring(0, match.length - 1);
	},

	_extractPath(url) {
		const host = this._extractHost(url);
		return url.substring(host.length, url.length);
	}
};