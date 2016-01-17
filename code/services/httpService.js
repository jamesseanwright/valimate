'use strict';

const http = require('http');
const https = require('https');
const urlParser = require('./urlParser');

function makeRequest(method, url, options) {
	return new Promise((resolve, reject) => {
		var requestOptions = {
			hostname: urlParser.getHost(url),
			path: urlParser.getPath(url),
			method
		};

		if (options) {
			requestOptions = Object.assign(requestOptions, options);
		}

		const requester = getRequester(url);

		const request = requester(requestOptions, res => onResponse(res, resolve, reject));

		request.on('error', reject);

		if (requestOptions.body) {
			request.write(requestOptions.body);
		}

		request.end();	
	});
}

function getRequester(url) {
	return urlParser.isHttps(url) ? https.request : http.request;
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
	post(url, options) {
		return makeRequest('POST', url, options);
	},

	get(url, options) {
		return makeRequest('GET', url, options);
	}
};