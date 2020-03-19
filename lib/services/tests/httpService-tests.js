'use strict';

const request = require('request');
const httpService = require('../httpService');

describe('the HTTP service', function() {
	describe('the _hasRequestFailed method', function() {
		it('should return true if the status code is at least 400', function() {
			const hasFailed = httpService._hasRequestFailed({
				statusCode: 400,
			});

			expect(hasFailed).to.be.true;
		});

		it('should return false if the code is below 400', function() {
			const hasFailed = httpService._hasRequestFailed({
				statusCode: 200,
			});

			expect(hasFailed).to.be.false;
		});
	});

	describe('the _request method', function() {
		afterEach(function() {
			if (httpService._createOptions.restore) {
				httpService._createOptions.restore();
			}

			if (httpService._hasRequestFailed.restore) {
				httpService._hasRequestFailed.restore();
			}

			if (request.get.restore) {
				request.get.restore();
			}
		});

		it('should reject the returned Promise if the callback passed to request is invoked with an error', function() {
			const error = new Error();

			sinon.stub(httpService, '_createOptions').returns({});

			sinon.stub(request, 'get').callsArgWith(1, error);

			return httpService._request('get', 'http://foo').catch(actualError => {
				expect(actualError).to.equal(error);
			});
		});

		it('should reject the returned Promise if _hasRequestFailed returns true', function() {
			const url = 'http://foo';

			sinon.stub(httpService, '_createOptions').returns({});

			sinon.stub(httpService, '_hasRequestFailed').returns(true);

			sinon.stub(request, 'get').callsArgWith(1, null, { url, status: 400 });

			return httpService._request('get', url).catch(actualError => {
				expect(actualError.message).to.equal(
					'Request to http://foo failed with HTTP 400',
				);
			});
		});

		it('should resolve the returned Promise with the response body if _hasRequestFailed returns false', function() {
			const body = {};

			sinon.stub(httpService, '_createOptions').returns({});

			sinon.stub(httpService, '_hasRequestFailed').returns(false);

			sinon.stub(request, 'get').callsArgWith(1, null, null, body);

			return httpService._request('get', 'http://foo').then(actualBody => {
				expect(actualBody).to.equal(body);
			});
		});
	});
});
