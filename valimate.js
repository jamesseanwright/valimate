#!/usr/bin/env node

'use strict';

const file = process.argv[2] ? process.argv[2] : 'valimate.json';
const config = require(process.cwd() + '/' + file);
const valimate = require('./lib');

valimate.validate(config, true);
