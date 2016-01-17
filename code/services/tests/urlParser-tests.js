'use strict';

const urlParser = require('../urlParser');

describe('the URL parser', function () {
	describe('the getHost method', function () {
		it('should remove a trailing slash', function () {
			const url = 'http://google.com/';
			const expectedHost = 'google.com';
			const actualHost = urlParser.getHost(url);

			expect(actualHost).to.equal(expectedHost);
		});

		it('should preserve the last character if there is no slash', function () {
			const url = 'http://google.com';
			const expectedHost = 'google.com';
			const actualHost = urlParser.getHost(url);

			expect(actualHost).to.equal(expectedHost);
		});

		it('should remove any paths', function () {
			const url = 'http://google.com/some-resource';
			const expectedHost = 'google.com';
			const actualHost = urlParser.getHost(url);

			expect(actualHost).to.equal(expectedHost);
		});

		it('should work with HTTPS', function () {
			const url = 'https://google.com/some-resource';
			const expectedHost = 'google.com';
			const actualHost = urlParser.getHost(url);

			expect(actualHost).to.equal(expectedHost);
		});

		it('should handle subdomains', function () {
			const url = 'https://shopping.google.com/some-resource';
			const expectedHost = 'shopping.google.com';
			const actualHost = urlParser.getHost(url);
			
			expect(actualHost).to.equal(expectedHost);
		});

		it('should preserve the HTTP protocol when requested', function () {
			const url = 'http://google.com/some-resource';
			const expectedHost = 'http://google.com';
			const actualHost = urlParser.getHost(url, true);
			
			expect(actualHost).to.equal(expectedHost);
		});

		it('should preserve the HTTPS protocol when requested', function () {
			const url = 'https://google.com/some-resource';
			const expectedHost = 'https://google.com';
			const actualHost = urlParser.getHost(url, true);
			
			expect(actualHost).to.equal(expectedHost);
		});
	});

	describe('the getProtocol method', function () {
		it('should extract the HTTP protocol', function () {
			const url = 'http://google.com/';
			const expectedProtocol = 'http://';
			const actualProtocol = urlParser.getProtocol(url);

			expect(actualProtocol).to.equal(expectedProtocol);
		});

		it('should extract the HTTPS protocol', function () {
			const url = 'https://google.com/';
			const expectedProtocol = 'https://';
			const actualProtocol = urlParser.getProtocol(url);

			expect(actualProtocol).to.equal(expectedProtocol);
		});
	});

	describe('the getPath method', function () {
		it('should remove the host', function () {
			const url = 'https://google.com/some-resource';
			const expectedPath = '/some-resource';
			const actualPath = urlParser.getPath(url);

			expect(actualPath).to.equal(expectedPath);
		});

		it('should handle multiple slashes', function () {
			const url = 'https://google.com/some-resource/sub-resource';
			const expectedPath = '/some-resource/sub-resource';
			const actualPath = urlParser.getPath(url);

			expect(actualPath).to.equal(expectedPath);
		});
	});

	describe('the isHttps method', function () {
		it('should return true for HTTPS', function () {
			const url = 'https://google.com/';

			expect(urlParser.isHttps(url)).to.equal(true);
		});

		it('should return false for HTTP', function () {
			const url = 'http://google.com/';

			expect(urlParser.isHttps(url)).to.equal(false);
		});
	});
});