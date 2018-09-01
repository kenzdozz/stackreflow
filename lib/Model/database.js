'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pg = require('pg');

const pool = new _pg.Pool({
  user: 'kenzdozz',
  host: 'localhost',
  database: 'stackreflow',
  password: 'chidozie',
  port: 5432
});

exports.default = pool;