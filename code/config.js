'use strict';

const userConfig = require(process.cwd() + '/valimate.json');

const defaults = {
	failHard: true
};

module.exports = Object.assign(defaults, userConfig);