'use strict';

var http = require('http');
var https = require('https');
var url = require('url');
var httpService = require('../httpService');

describe('the HTTP service', function () {
	describe('the getRequester method', function () {
		it('should return http.request for HTTP requests', function () {
			const urlString = 'http://lol.com';
			const requester = httpService._getRequester(url.parse(urlString));

			expect(requester).to.equal(http.request);
		});

		it('should return https.request for HTTPS requests', function () {
			const urlString = 'https://lol.com';
			const requester = httpService._getRequester(url.parse(urlString));

			expect(requester).to.equal(https.request);
		});
	});
});