'use strict';

const keepAlive = require('net').createServer().listen(10012);
const config = require(process.cwd() + '/valimate.json');
const runner = require('./runner');

const results = runner(config.urls);
resultsPrinter.print(results);

process.exit(results.hasErrors ? 1 : 0);