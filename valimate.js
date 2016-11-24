#!/usr/bin/env node

'use strict';

const config = require('./lib/config');
const valimate = require('./lib');

valimate.validate(config, true);