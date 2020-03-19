'use strict';

const request = require('request');

module.exports = {
	post(url, options) {
		return this._request('post', url, options);
	},

	get(url, options) {
		return this._request('get', url, options);
	},

	_request(method, url, options) {
		return new Promise((resolve, reject) => {
			const requestOptions = this._createOptions(url, options);

			request[method](requestOptions, (err, response, body) => {
				if (err) {
					reject(err);
					return;
				}

				if (this._hasRequestFailed(response)) {
					reject(
						new Error(
							`Request to ${response.url} failed with HTTP ${response.status}`,
						),
					);
					return;
				}

				resolve(body);
			});
		});
	},

	_createOptions(url, options) {
		let requestOptions = { url };

		if (options) {
			requestOptions = Object.assign({}, requestOptions, options);
		}

		return requestOptions;
	},

	_hasRequestFailed(response) {
		return response.statusCode >= 400;
	},
};
