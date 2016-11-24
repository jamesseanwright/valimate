'use strict';

/* This is the effectively the same as the
 * end-to-end test ran by invoking the library's
 * entry point via the `npm test` script. This
 * additional check ensures that the programmatic
 * API also works as expected */

const VALIDATION_MODE = 'validationMode';
const START_UP_FAILED = 'Unable to start local app server!';

const fork = require('child_process').fork;
const valimate = require('../');

function startTestServer() {
	return new Promise((resolve, reject) => {
		const server = fork('test/testServer.js', [VALIDATION_MODE], {
			env: { TEST: 'true' }
		});

		server.on('message', isRunning => {
			if (!isRunning) {
				reject(new Error(START_UP_FAILED));
				return;
			}

			resolve(server);
		});
	});
}

describe('the programmatic end-to-end test', function () {
	it('should be importable as a CommonJS module and should validate the configured URLs', function () {
		const config = {
			urls: [
				'http://localhost:8081',
				'http://localhost:8081/301-redirect',
				'http://localhost:8081/302-redirect'
			]
		};

		let server;

		return startTestServer()
			.then(s => server = s)
			.then(() => valimate.validate(config))
			.then(isInvalid => {
				expect(isInvalid).to.be.false;
				server.kill();
			})
			.catch(e => {
				console.error(e);
				server.kill();
			});
	});
});