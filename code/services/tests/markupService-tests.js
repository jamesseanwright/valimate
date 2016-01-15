'use strict';

const markupService = require('../markupService');

describe('the markup service', function () {
	describe('the extractHost method', function () {
		it('should remove a trailing slash', function () {
			const url = 'http://google.com/';
			const expectedHost = 'http://google.com';
			const actualHost = markupService._extractHost(url);

			expect(actualHost).to.equal(expectedHost);
		});

		it('should remove any paths', function () {
			const url = 'http://google.com/some-resource';
			const expectedHost = 'http://google.com';
			const actualHost = markupService._extractHost(url);

			expect(actualHost).to.equal(expectedHost);
		});

		it('should work with HTTPS', function () {
			const url = 'https://google.com/some-resource';
			const expectedHost = 'https://google.com';
			const actualHost = markupService._extractHost(url);

			expect(actualHost).to.equal(expectedHost);
		});
	});

	describe('the extractPath method', function () {
		it('should remove the host', function () {
			const url = 'https://google.com/some-resource';
			const expectedPath = '/some-resource';
			const actualPath = markupService._extractPath(url);

			expect(actualPath).to.equal(expectedPath);
		});

		it('should handle multiple slashes', function () {
			const url = 'https://google.com/some-resource/sub-resource';
			const expectedPath = '/some-resource/sub-resource';
			const actualPath = markupService._extractPath(url);

			expect(actualPath).to.equal(expectedPath);
		});
	});
});