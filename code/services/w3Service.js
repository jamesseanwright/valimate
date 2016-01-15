'use strict';

const httpService = require('./httpService');

const VALIDATOR_HOST = 'https://validator.w3.org';
const VALIDATOR_PATH = '/nu/';

module.exports = {
	send(markup) {
		return httpService.post({
			host: VALIDATOR_HOST,
			path: `${VALIDATOR_PATH}?out=json`,
			body: markup,
			
			headers: {
				'Content-Type': 'text/html; charset=utf-8',
				'Content-Length': markup.length
			}
		});
	}
};