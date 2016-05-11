'use strict';

const Result = require('../Result');

const data = `{
	"messages": [
		{
			"type": "info"
		},

		{
			"type": "info"
		},

		{
			"type": "info"
		},

		{
			"type": "info"
		},

		{
			"type": "warning"
		},

		{
			"type": "warning"
		},

		{
			"type": "error"
		}
	]
}`;

const result = new Result(null, data);

describe('the Result class', function () {
	describe('the info property', function () {
		it('should only return messages of the info type', function () {
			expect(result.info.length).to.equal(4);
		});
	});

	describe('the warnings property', function () {
		it('should only return messages of the warnings type', function () {
			expect(result.warnings.length).to.equal(2);
		});
	});

	describe('the errors property', function () {
		it('should only return messages of the errors type', function () {
			expect(result.errors.length).to.equal(1);
		});
	});
});