'use strict';

const httpService = require('./httpService');
const Result = require('../models/Result');

const VALIDATOR_HOST = 'validator.w3.org';
const VALIDATOR_PATH = '/nu/';

module.exports = {
	send(markup) {
		return httpService.post({
			host: VALIDATOR_HOST,
			path: `${VALIDATOR_PATH}?out=json`,
			body: markup
		}).then(response => new Result(response));
	}
};