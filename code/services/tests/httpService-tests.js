'use strict';

var http = require('http');
var https = require('https');
var httpService = require('../httpService');

describe('the HTTP service', function () {
	describe('the getRequester method', function () {
		it('should return http.request for HTTP requests', function () {
			const url = 'http://lol.com';
			const requester = httpService._getRequester(url);

			expect(requester).to.equal(http.request);
		});

		it('should return https.request for HTTPS requests', function () {
			const url = 'https://lol.com';
			const requester = httpService._getRequester(url);

			expect(requester).to.equal(https.request);
		});
	});
});