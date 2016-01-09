'use strict';

const messages = Symbol('messages');

module.exports = class Result {
	constructor(response) {
		this[messages] = response.messages;
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