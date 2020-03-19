'use strict';

const markupService = require('./services/markupService');
const w3Service = require('./services/w3Service');
const Result = require('./models/Result');

module.exports = {
  _createPromise(url, validatorUrl) {
    return markupService
      .get(url)
      .then(markup => w3Service.send(validatorUrl, markup))
      .then(response => {
        return new Result(url, response);
      });
  },

  run(config) {
    const promises = config.urls.map(url =>
      this._createPromise(url, config.validatorUrl)
    );

    return Promise.all(promises);
  }
};
