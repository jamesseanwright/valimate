const https = require('https');

const VALIDATOR_HOST = 'validator.w3.org';
const VALIDATOR_PATH = '/nu/';

module.exports = {
	send(markup) {
		return new Promise((resolve, reject) => {
			const options = {
				hostname: host,
				path: `${path}?out=json`,
				method: 'POST',

				headers: {
					'Content-Type': 'text/html; charset=utf-8',
					'Content-Length': markup.length
				}
			};

			const request = https.request(options, res => this.onResponse(res, resolve, reject));

			request.on('error', reject);

			request.write(markup);
			request.end();
		});
	},

	onResponse(response, resolve, reject) {

		const hasResponseFailed = response.status >= 400;
		var responseBody = '';

		if (hasResponseFailed) {
			reject(`Request to ${VALIDATOR_HOST} failed with HTTP ${response.status}`);
		}

		response.on('data', chunk => responseBody += chunk.toString());
		response.on('end', () => console.log(responseBody) && resolve(JSON.parse(responseBody)));
	}
};