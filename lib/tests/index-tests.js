'use strict';

const entryPoint = require('../');
const localAppServer = require('../localAppServer');
const runner = require('../runner');
const resultsPrinter = require('../resultsPrinter');

describe('The entry point', function() {
  let mockConsole;
  let mockLocalAppServer;

  beforeEach(function() {
    mockConsole = sinon.mock(console);
    mockLocalAppServer = sinon.mock(localAppServer);
  });

  afterEach(function() {
    mockConsole.restore();
    mockLocalAppServer.restore();
  });

  describe('the _isInvalid method', function() {
    afterEach(function() {
      if (entryPoint._hasErrors.restore) {
        entryPoint._hasErrors.restore();
      }
    });

    it('should log a congratulatory message and proxy the return value of _hasErrors if the markup is valid', function() {
      sinon.stub(entryPoint, '_hasErrors').returns(false);

      mockConsole
        .expects('info')
        .once()
        .withArgs('Congratulations! Your HTML is valid!');

      const isInvalid = entryPoint._isInvalid();

      expect(isInvalid).to.be.false;
      mockConsole.verify();
    });

    it('should not log a congratulatory message if the markup is invalid', function() {
      sinon.stub(entryPoint, '_hasErrors').returns(true);

      mockConsole.expects('info').never();

      const isInvalid = entryPoint._isInvalid();

      expect(isInvalid).to.be.true;
      mockConsole.verify();
    });
  });

  describe('the _hasErrors method', function() {
    it('should return true if a result object`s errors array contains items', function() {
      const results = [
        {
          errors: ['Error', 'Error']
        }
      ];

      const hasErrors = entryPoint._hasErrors(results);

      expect(hasErrors).to.be.true;
    });

    it('should return false if a result object`s errors array is empty', function() {
      const results = [
        {
          errors: []
        }
      ];

      const hasErrors = entryPoint._hasErrors(results);

      expect(hasErrors).to.be.false;
    });
  });

  describe('the _exit method', function() {
    let mockProcess;

    beforeEach(function() {
      mockProcess = sinon.mock(process);
    });

    afterEach(function() {
      mockProcess.restore();
    });

    it('should exit with a zero exit code if the markup is valid', function() {
      const isInvalid = false;
      const failHard = false;
      const exitCode = 0;

      mockProcess
        .expects('exit')
        .once()
        .withArgs(exitCode);

      entryPoint._exit(isInvalid, failHard);

      mockProcess.verify();
    });

    it('should exit with a zero exit code if the markup is invalid but hard failure is disabled', function() {
      const isInvalid = true;
      const failHard = false;
      const exitCode = 0;

      mockProcess
        .expects('exit')
        .once()
        .withArgs(exitCode);

      entryPoint._exit(isInvalid, failHard);

      mockProcess.verify();
    });

    it('should exit with a non-zero exit code if the markup is invalid and hard failure is enabled', function() {
      const isInvalid = true;
      const failHard = true;
      const exitCode = 1;

      mockProcess
        .expects('exit')
        .once()
        .withArgs(exitCode);

      entryPoint._exit(isInvalid, failHard);

      mockProcess.verify();
    });
  });

  describe('the _cleanup method', function() {
    let mockResultsPrinter;

    beforeEach(function() {
      mockResultsPrinter = sinon.mock(resultsPrinter);
    });

    afterEach(function() {
      mockResultsPrinter.restore();
    });

    it('should reset stdout', function() {
      const hasLocalAppServer = false;

      mockResultsPrinter.expects('resetStdout').once();

      mockLocalAppServer.expects('stop').never();

      entryPoint._cleanup(hasLocalAppServer);

      mockResultsPrinter.verify();
      mockLocalAppServer.verify();
    });

    it('should stop the local app server if configured', function() {
      const hasLocalAppServer = true;

      mockResultsPrinter.expects('resetStdout').once();

      mockLocalAppServer.expects('stop').once();

      entryPoint._cleanup(hasLocalAppServer);

      mockResultsPrinter.verify();
      mockLocalAppServer.verify();
    });
  });

  describe('the validate method', function() {
    let mockEntryPoint;

    beforeEach(function() {
      mockEntryPoint = sinon.mock(entryPoint);
    });

    afterEach(function() {
      if (resultsPrinter.printResults.restore) {
        resultsPrinter.printResults.restore();
      }

      if (runner.run.restore) {
        runner.run.restore();
      }

      mockEntryPoint.restore();
    });

    it('should return a rejected Promise with an error if no config is specified', function() {
      return entryPoint.validate().catch(e => {
        expect(e.message).to.equal('No config specified!');
      });
    });

    it('should start the local app server if specified in the config', function() {
      const isCliRun = false;
      const isInvalid = true;
      const localAppServer = {};
      const config = { localAppServer };

      mockLocalAppServer
        .expects('start')
        .once()
        .returns(Promise.resolve());

      /* should be a stub, but reusing mock
       * ref for the sake of simplicity */
      mockEntryPoint.expects('_isInvalid').returns(isInvalid);

      mockEntryPoint.expects('_cleanup').returns(undefined);

      sinon.stub(resultsPrinter, 'printResults').returns(Promise.resolve());

      sinon.stub(runner, 'run').returns(Promise.resolve());

      return entryPoint.validate(config, isCliRun).then(() => {
        mockLocalAppServer.verify();
      });
    });

    it('should not start the local app server if not specified in the config', function() {
      const isCliRun = false;
      const isInvalid = true;
      const config = {};

      mockLocalAppServer.expects('start').never();

      mockEntryPoint.expects('_isInvalid').returns(isInvalid);

      sinon.stub(resultsPrinter, 'printResults').returns(Promise.resolve());

      sinon.stub(runner, 'run').returns(Promise.resolve());

      return entryPoint.validate(config, isCliRun).then(() => {
        mockLocalAppServer.verify();
      });
    });

    it('should exit if ran as a CLI', function() {
      const isCliRun = true;
      const isInvalid = true;
      const config = {};

      mockEntryPoint.expects('_isInvalid').returns(isInvalid);

      mockEntryPoint.expects('_exit').once();

      sinon.stub(resultsPrinter, 'printResults').returns(Promise.resolve());

      sinon.stub(runner, 'run').returns(Promise.resolve());

      return entryPoint.validate(config, isCliRun).then(() => {
        mockLocalAppServer.verify();
        mockEntryPoint.verify();
      });
    });

    it('should not exit if ran programmatically, and should proxy the result to the Promise chain', function() {
      const isCliRun = false;
      const isInvalid = true;
      const config = {};

      mockEntryPoint.expects('_isInvalid').returns(isInvalid);

      mockEntryPoint.expects('_exit').never();

      sinon.stub(resultsPrinter, 'printResults').returns(Promise.resolve());

      sinon.stub(runner, 'run').returns(Promise.resolve());

      return entryPoint.validate(config, isCliRun).then(isInvalid => {
        expect(isInvalid).to.be.true;
        mockEntryPoint.verify();
      });
    });
  });
});
