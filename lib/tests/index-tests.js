'use strict';

const entryPoint = require('../');

describe('The entry point', function () {
	describe('the _determineValidity method', function () {
		const mockConsole = sinon.mock(console);

		afterEach(function () {
			if (entryPoint._hasErrors.restore) {
				entryPoint._hasErrors.restore();
			}

			mockConsole.restore();
		});

		it('should log a congratulatory message and proxy the return value of _hasErrors if the markup is valid', function () {
			sinon.stub(entryPoint, '_hasErrors')
				.returns(false);

			mockConsole.expects('info')
				.once()
				.withArgs('Congratulations! Your HTML is valid!');

			const isInvalid = entryPoint._determineValidity();

			expect(isInvalid).to.be.false;
			mockConsole.verify();
		});

		it('should not log a congratulatory message if the markup is invalid', function () {
			sinon.stub(entryPoint, '_hasErrors')
				.returns(true);

			mockConsole.expects('info')
				.never();

			const isInvalid = entryPoint._determineValidity();

			expect(isInvalid).to.be.true;
			mockConsole.verify();
		});
	});

	describe('the _hasErrors method', function () {
		it('should return true if a result object`s errors array contains items', function () {
			const results = [
				{
					errors: ['Error', 'Error']
				}
			];

			const hasErrors = entryPoint._hasErrors(results);

			expect(hasErrors).to.be.true;
		});

		it('should return false if a result object`s errors array is empty', function () {
			const results = [
				{
					errors: []
				}
			];

			const hasErrors = entryPoint._hasErrors(results);

			expect(hasErrors).to.be.false;
		});
	});
});