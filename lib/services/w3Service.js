'use strict';

const metadata = require('../../package.json');
const httpService = require('./httpService');

const ENCODING = 'utf-8';

module.exports = {
	send(validatorUrl, markup) {
		return httpService.post(`${validatorUrl}?out=json`, {
			body: markup,

			headers: {
				'Content-Type': `text/html; charset=${ENCODING}`,
				'Content-Length': Buffer.byteLength(markup, ENCODING),
				'User-Agent': `Valimate ${metadata.version}`,
			},
		});
	},
};
