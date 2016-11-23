#!/usr/bin/env node

const config = require('./lib/config');
const valimate = require('./lib');

valimate(config);