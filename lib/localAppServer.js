'use strict';

const fork = require('child_process').fork;

const START_UP_FAILED = 'Unable to start local app server!';
const VALIDATION_MODE = 'validationMode';

module.exports = {
	start(localAppServer) {
		// No destructuring in Node.js 4 :(
		const entryPoint = localAppServer.entryPoint;
		const env = localAppServer.env;
		const options = env ? { env } : null;

		console.info(`Waiting for ${entryPoint} to start up before validating...`);

		return new Promise((resolve, reject) => {
			this.server = fork(entryPoint, [VALIDATION_MODE], options);

			this.server.on('message', isRunning => {
				if (!isRunning) {
					reject(new Error(START_UP_FAILED));
				} else {
					resolve();
				}
			});
		});
	},

	stop() {
		this.server.kill();
	},
};
