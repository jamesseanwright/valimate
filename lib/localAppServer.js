'use strict';

const fork = require('child_process').fork;

const START_UP_FAILED = 'Unable to start local app server!';
const VALIDATION_MODE = 'validationMode'

module.exports = {
	start(serverPath) {
		console.info(`Waiting for ${serverPath} to start up before validating...`);

		return new Promise((resolve, reject) => {
			this.server = fork(serverPath, [VALIDATION_MODE]);
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
	}
};