'use strict';

const HOST_REGEX = /^http(s?)\:\/\/(.*)\.[a-z\.]{2,}\//i;
const HTTPS_REGEX = /^https/;
const PROTOCOL_REGEX = /^http(s?)\:\/\//;
const PATH_DELIMITER = '/';
const INVALID_HOST = 'The url {url} is invalid!';

module.exports = {
	_getFirstMatch(url, regex) {
		const matches = url.match(regex);

		if (!matches) {
			throw new Error(INVALID_HOST.replace('{url}', url));
		}

		const match = matches[0];

		return match.substring(0, match.length);
	},

	getHost(url, preserveProtocol) {
		const host = this._getFirstMatch(url, HOST_REGEX);

		if (!preserveProtocol) {
			const protocol = this.getProtocol(url);
			return host.substring(protocol.length, host.length - 1);
		}

		return host.substring(0, host.length - 1);
	},

	getProtocol(url) {
		return this._getFirstMatch(url, PROTOCOL_REGEX);
	},

	getPath(url) {
		const host = this.getHost(url, true);
		return url.substring(host.length, url.length);
	},

	isHttps(host) {
		return !!host.match(HTTPS_REGEX);
	}
};