'use strict';

const request = require('request');

module.exports = {
	post(url, options) {
		return this._makeRequest('POST', url, options);
	},

	get(url, options) {
		return this._makeRequest('GET', url, options);
	},

	_makeRequest(method, urlString, options) {
		return new Promise((resolve, reject) => {
			const requestOptions = this._createOptions(method, urlString, options);
			
			request(requestOptions, (err, response, body) => { 
				if (this._hasRequestFailed(response)) {
					reject(new Error(`Request to ${response.url} failed with HTTP ${response.status}`));
					return;
				}

				resolve(body);
			});
		});
	},

	_createOptions(method, url, options) {
		var requestOptions = {
			url,
			method
		};

		if (options) {
			requestOptions = Object.assign(requestOptions, options);
		}

		return requestOptions
	},

	_hasRequestFailed(response) {
		return response.statusCode >= 400;
	}
};