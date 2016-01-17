'use strict';

const http = require('http');
const https = require('https');
const urlParser = require('./urlParser');

module.exports = {
	post(url, options) {
		return this._makeRequest('POST', url, options);
	},

	get(url, options) {
		return this._makeRequest('GET', url, options);
	},

	_makeRequest(method, url, options) {
		return new Promise((resolve, reject) => {
			const requestOptions = this._createOptions(method, url, options);
			const requester = this._getRequester(url);
			const request = requester(requestOptions, res => this._onResponse(res, resolve, reject));

			request.on('error', reject);

			if (requestOptions.body) {
				request.write(requestOptions.body);
			}

			request.end();
		});
	},

	_createOptions(method, url, options) {
		var requestOptions = {
			hostname: urlParser.getHost(url),
			path: urlParser.getPath(url),
			method
		};

		if (options) {
			requestOptions = Object.assign(requestOptions, options);
		}

		return requestOptions
	},

	_onResponse(response, resolve, reject) {
		const hasResponseFailed = response.status >= 400;
		var responseBody = '';

		if (hasResponseFailed) {
			reject(`Request to ${response.url} failed with HTTP ${response.status}`);
		}

		response.on('data', chunk => responseBody += chunk.toString());
		response.on('end', () => resolve(responseBody));
	},

	_getRequester(url) {
		return urlParser.isHttps(url) ? https.request : http.request;
	}
};