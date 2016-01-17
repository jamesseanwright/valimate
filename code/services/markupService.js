'use strict';

const httpService = require('./httpService');

const SANTISATION_REGEX = /[\n\r\t]/g

module.exports = {
	get(url) {
		return httpService.get(url);
	}
 };