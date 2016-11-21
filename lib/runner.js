'use strict';

const config = require('./config');
const markupService = require('./services/markupService');
const w3Service = require('./services/w3Service');
const Result = require('./models/Result');

function createPromise(url) {
	return markupService.get(url)
		.then(w3Service.send)
		.then(response => {
			return new Result(url, response);
		});
}

module.exports = function runner() {
	const promises = config.urls.map(createPromise);

	return Promise.all(promises)
			.catch(e => {
				console.error(e);
			});
};