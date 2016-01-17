'use strict';

const userConfig = require(process.cwd() + '/valimate.json');

const defaults = {
	failHard: true,
	validatorUrl: 'https://validator.w3.org/nu/'
};

const mergedConfig = Object.assign(defaults, userConfig);

module.exports = mergedConfig;