'use strict';

function createPromise(url) {
	return markupService.get(url).then(w3Service.send);
}

module.exports = function runner(urls) {
	var promises = urls.map(createPromise);
};