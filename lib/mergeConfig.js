'use strict';

function mergeConfig(userConfig) {
	const defaults = {
		failHard: true,
		validatorUrl: 'https://validator.w3.org/nu/',
		localAppServer: null
	};

	return Object.assign(defaults, userConfig);
}


module.exports = mergeConfig;