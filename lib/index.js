'use strict';

const intro = require('./intro');
const runner = require('./runner');
const localAppServer = require('./localAppServer');
const resultsPrinter = require('./resultsPrinter');
const mergeConfig = require('./mergeConfig');

module.exports = {
  _isInvalid(results) {
    const isInvalid = this._hasErrors(results);

    if (!isInvalid) {
      console.info('Congratulations! Your HTML is valid!');
    }

    return isInvalid;
  },

  _hasErrors(results) {
    return results.some(result => result.errors.length);
  },

  _cleanup(hasLocalAppServer) {
    if (hasLocalAppServer) {
      localAppServer.stop();
    }

    resultsPrinter.resetStdout();
  },

  _exit(isInvalid, failHard) {
    const exitCode = isInvalid && failHard ? 1 : 0;
    process.exit(exitCode);
  },

  validate(config, isCliRun) {
    if (!config) {
      return Promise.reject(new Error('No config specified!'));
    }

    config = mergeConfig(config);

    // No destructing in Node.js 4 brah
    const appServerOptions = config.localAppServer;
    const failHard = config.failHard;

    intro();

    const prerun = appServerOptions
      ? localAppServer.start(appServerOptions)
      : Promise.resolve();

    return prerun
      .then(() => runner.run(config))
      .then(results => resultsPrinter.printResults(results))
      .then(results => this._isInvalid(results))
      .then(isInvalid => {
        this._cleanup(!!appServerOptions);
        return isInvalid;
      })
      .then(isInvalid =>
        isCliRun ? this._exit(isInvalid, failHard) : isInvalid
      )
      .catch(e => {
        console.error(e);
        this._exit(true, failHard);
      });
  }
};
