'use strict';

const config = require('./config');
const markupService = require('./services/markupService');
const w3Service = require('./services/w3Service');
const Result = require('./models/Result');

module.exports = {
	_createPromise(url) {
		return markupService.get(url)
			.then(w3Service.send)
			.then(response => {
				return new Result(url, response);
			});
	},

	run() {
		const promises = config.urls.map(this._createPromise);

		return Promise.all(promises)
				.catch(e => {
					console.error(e);
				});
	}
};