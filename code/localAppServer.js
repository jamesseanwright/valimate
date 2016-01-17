'use strict';

const fork = require('child_process').fork;

const START_UP_FAILED = 'Unable to start local app server!';

module.exports = {
	start(serverPath) {
		return new Promise((resolve, reject) => {
			const server = fork(serverPath);
			server.on('message', function (isRunning) {
				if (!isRunning) {
					reject(new Error(START_UP_FAILED));
				} else {
					resolve();
				}
			});
		});
	}
};