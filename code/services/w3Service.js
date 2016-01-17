'use strict';

const config = require('../config');
const httpService = require('./httpService');

module.exports = {
	send(markup) {
		return httpService.post(`${config.validatorUrl}?out=json`, {
			body: markup,

			headers: {
				'Content-Type': 'text/html; charset=utf-8',
				'Content-Length': markup.length
			}
		});
	}
};