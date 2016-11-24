'use strict';

const entryPoint = require('../');
const localAppServer = require('../localAppServer');
const resultsPrinter = require('../resultsPrinter');

describe('The entry point', function () {
	let mockConsole;

	beforeEach(function () {
		mockConsole = sinon.mock(console);
	});

	afterEach(function () {
		mockConsole.restore();
	});

	describe('the _determineValidity method', function () {
		afterEach(function () {
			if (entryPoint._hasErrors.restore) {
				entryPoint._hasErrors.restore();
			}
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

	describe('the _exit method', function () {
		let mockLocalAppServer;
		let mockResultsPrinter;
		let mockProcess;

		beforeEach(function () {
			mockLocalAppServer = sinon.mock(localAppServer);
			mockResultsPrinter = sinon.mock(resultsPrinter);
			mockProcess = sinon.mock(process);
		});

		afterEach(function () {
			mockLocalAppServer.restore();
			mockResultsPrinter.restore();
			mockProcess.restore();
		});

		it('should reset stdout', function () {
			const isInvalid = false;
			const isCliRun = false;
			const failHard = false;
			const hasLocalAppServer = false;

			mockResultsPrinter.expects('resetStdout')
				.once();

			mockProcess.expects('exit')
				.never();

			mockLocalAppServer.expects('stop')
				.never();

			entryPoint._exit(isInvalid, isCliRun, failHard, hasLocalAppServer);

			mockLocalAppServer.verify();
			mockResultsPrinter.verify();
			mockProcess.verify();
		});

		it('stop the local app server if it has been configured', function () {
			const isInvalid = false;
			const isCliRun = false;
			const failHard = false;
			const hasLocalAppServer = true;

			mockResultsPrinter.expects('resetStdout')
				.once();

			mockProcess.expects('exit')
				.never();

			mockLocalAppServer.expects('stop')
				.once();

			entryPoint._exit(isInvalid, isCliRun, failHard, hasLocalAppServer);

			mockLocalAppServer.verify();
			mockResultsPrinter.verify();
			mockProcess.verify();
		});

		it('should exit with a zero exit code if it`s a CLI run and the markup is valid', function () {
			const isInvalid = false;
			const isCliRun = true;
			const failHard = false;
			const hasLocalAppServer = false;
			const exitCode = 0;

			mockResultsPrinter.expects('resetStdout')
				.once();

			mockProcess.expects('exit')
				.once()
				.withArgs(exitCode);

			mockLocalAppServer.expects('stop')
				.never();

			entryPoint._exit(isInvalid, isCliRun, failHard, hasLocalAppServer);

			mockLocalAppServer.verify();
			mockResultsPrinter.verify();
			mockProcess.verify();
		});

		it('should exit with a zero exit code if it`s a CLI run and the markup is invalid but hard failure is disabled', function () {
			const isInvalid = true;
			const isCliRun = true;
			const failHard = false;
			const hasLocalAppServer = false;
			const exitCode = 0;

			mockResultsPrinter.expects('resetStdout')
				.once();

			mockProcess.expects('exit')
				.once()
				.withArgs(exitCode);

			mockLocalAppServer.expects('stop')
				.never();

			entryPoint._exit(isInvalid, isCliRun, failHard, hasLocalAppServer);

			mockLocalAppServer.verify();
			mockResultsPrinter.verify();
			mockProcess.verify();
		});

		it('should exit with a non-zero exit code if it`s a CLI run and the markup is invalid and hard failure is enabled', function () {
			const isInvalid = true;
			const isCliRun = true;
			const failHard = true;
			const hasLocalAppServer = false;
			const exitCode = 1;

			mockResultsPrinter.expects('resetStdout')
				.once();

			mockProcess.expects('exit')
				.once()
				.withArgs(exitCode);

			mockLocalAppServer.expects('stop')
				.never();

			entryPoint._exit(isInvalid, isCliRun, failHard, hasLocalAppServer);

			mockLocalAppServer.verify();
			mockResultsPrinter.verify();
			mockProcess.verify();
		});

		it('should not exit if Valimate was invoked programmatically', function () {
			const isInvalid = false;
			const isCliRun = false;
			const failHard = false;
			const hasLocalAppServer = false;

			mockResultsPrinter.expects('resetStdout')
				.once();

			mockProcess.expects('exit')
				.never();

			mockLocalAppServer.expects('stop')
				.never();

			entryPoint._exit(isInvalid, isCliRun, failHard, hasLocalAppServer);

			mockLocalAppServer.verify();
			mockResultsPrinter.verify();
			mockProcess.verify();
		});
	});
});