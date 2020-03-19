'use strict';

const messages = Symbol('messages');

module.exports = class Result {
	constructor(url, response) {
		this.url = url;
		this[messages] = JSON.parse(response).messages;
	}

	get info() {
		return this[messages].filter(m => m.type === 'info');
	}

	get warnings() {
		return this[messages].filter(m => m.type === 'warning');
	}

	get errors() {
		return this[messages].filter(m => m.type === 'error');
	}
};
