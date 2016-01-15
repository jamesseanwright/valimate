'use strict';

const http = require('http');
const https = require('https');

const HTTPS_REGEX = /^https/;
const PROTOCOL_REGEX = /^http(s?)\:\/\//;
const INDETERMINABLE_HOST = 'Unable to determine host';

function makeRequest(method, options) {
	return new Promise((resolve, reject) => {
		const requestOptions = {
			hostname: getHostname(options.host),
			path: options.path,
			method,
			headers: options.headers
		};

		const requester = getRequester(options.host);

		const request = requester(requestOptions, res => onResponse(res, resolve, reject));

		request.on('error', reject);

		if (options.body) {
			request.write(options.body);
		}

		request.end();	
	});
}

function getHostname(host) {
	const protocol = host.match(PROTOCOL_REGEX);

	if (!protocol) {
		throw new Error(INDETERMINABLE_HOST);
	}

	return host.substring(protocol[0].length, host.length);
}

function getRequester(host) {
	const isHttps = host.match(HTTPS_REGEX);
	return isHttps ? https.request : http.request;
}

function onResponse(response, resolve, reject) {
	const hasResponseFailed = response.status >= 400;
	var responseBody = '';

	if (hasResponseFailed) {
		reject(`Request to ${response.url} failed with HTTP ${response.status}`);
	}

	response.on('data', chunk => responseBody += chunk.toString());
	response.on('end', () => resolve(responseBody));
}

module.exports = {
	post(options) {
		return makeRequest('POST', options);
	},

	get(options) {
		return makeRequest('GET', options);
	}
};