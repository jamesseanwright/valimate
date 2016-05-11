'use strict';

const http = require('http');
const https = require('https');
const url = require('url');

module.exports = {
	post(url, options) {
		return this._makeRequest('POST', url, options);
	},

	get(url, options) {
		return this._makeRequest('GET', url, options);
	},

	_makeRequest(method, urlString, options) {
		return new Promise((resolve, reject) => {
			const parsedUrl = url.parse(urlString);
			const requestOptions = this._createOptions(method, parsedUrl, options);
			const requester = this._getRequester(parsedUrl);
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
			hostname: url.hostname,
			path: url.path,
			port: url.port,
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
		const isHttps = url.protocol === 'https:';
		return isHttps ? https.request : http.request;
	}
};