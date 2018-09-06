'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pg = require('pg');

var _config = require('../config');

const pool = new _pg.Pool(_config.dbConnObj);

exports.default = pool;