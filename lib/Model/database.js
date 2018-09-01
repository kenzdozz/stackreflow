'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pg = require('pg');

var pool = new _pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stackreflow',
  password: '',
  port: 5432
});

exports.default = pool;