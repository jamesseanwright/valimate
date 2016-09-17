'use strict';

var httpService = require('../httpService');

describe('the HTTP service', function () {
	describe('the _hasRequestFailed method', function () {
		it('should return true if the status code is at least 400', function () {
			const hasFailed = httpService._hasRequestFailed({
				statusCode: 400
			});

			expect(hasFailed).to.be.true;
		});

		it('should return false if the code is below 400', function () {
			const hasFailed = httpService._hasRequestFailed({
				statusCode: 200
			});

			expect(hasFailed).to.be.false;
		});
	});
});