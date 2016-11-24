#!/usr/bin/env node

'use strict';

const config = require(process.cwd() + '/valimate.json');
const valimate = require('./lib');

valimate.validate(config, true);