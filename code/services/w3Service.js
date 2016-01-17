'use strict';

const config = require('../config');
const httpService = require('./httpService');

const ENCODING = 'utf-8';

module.exports = {
	send(markup) {
		return httpService.post(`${config.validatorUrl}?out=json`, {
			body: markup,

			headers: {
				'Content-Type': `text/html; charset=${ENCODING}`,
				'Content-Length': Buffer.byteLength(markup, ENCODING)
			}
		});
	}
};