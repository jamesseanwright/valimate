'use strict';

const markupService = require('./services/markupService'); 
const w3Service = require('./services/w3Service');
const Result = require('./models/Result');

function createPromise(url) {
	return markupService.get(url)
		.then(w3Service.send)
		.then(response => new Result(url, response));
}

module.exports = function runner(urls) {
	var promises = urls.map(createPromise);
	return Promise.all(promises);
};