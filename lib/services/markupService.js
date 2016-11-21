'use strict';

const httpService = require('./httpService');

module.exports = {
	get(url) {
		return httpService.get(url);
	}
};
