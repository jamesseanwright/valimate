'use strict';

const httpService = require('../httpService');
const w3Service = require('../w3Service');

describe('the W3 Service', function () {
	describe('the send method', function () {
		it('should build a valid request to send to the validator API', function () {
			const mockHttpService = sinon.mock(httpService);
			const markup = 'some html lol';
			
			mockHttpService.expects('post').once().withArgs({
				body: markup,
				host: 'https://validator.w3.org',
				path: '/nu/?out=json',

				headers: {
					'Content-Length': markup.length,
					'Content-Type': 'text/html; charset=utf-8'
				}
			}).returns(Promise.resolve());

			return w3Service.send(markup)
					.then(() => {
						mockHttpService.verify();
						mockHttpService.restore();
					});
		});
	});
});