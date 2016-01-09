'use strict';

function makeRequest(method, options) {
	return new Promise((resolve, reject) => {
		const requestOptions = {
			hostname: options.host,
			path: options.path,
			method,

			headers: {
				'Content-Type': 'text/html; charset=utf-8',
				'Content-Length': options.body ? options.body.length : 0
			}
		};

		const request = https.request(requestOptions, res => onResponse(res, resolve, reject));

		request.on('error', reject);

		if (options.body) {
			request.write(options.body);
		}

		request.end();		
	});
}

function onResponse(response, resolve, reject) {
	const hasResponseFailed = response.status >= 400;
	var responseBody = '';

	if (hasResponseFailed) {
		reject(`Request to ${response.url} failed with HTTP ${response.status}`);
	}

	response.on('data', chunk => responseBody += chunk.toString());
	response.on('end', () => resolve(JSON.parse(responseBody)));
}

module.exports = {
	post(options) {
		return makeRequest('POST', options);
	},

	get(options) {
		return makeRequest('GET', options);
	}
}