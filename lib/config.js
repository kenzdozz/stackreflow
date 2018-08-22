'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var jwtSecret = 'stackreflowing';
var code = {
  unAuthorized: 401,
  notFound: 404,
  serverError: 500,
  ok: 200,
  created: 201,
  accepted: 202,
  badRequest: 400,
  forbidden: 403,
  notAllowed: 405,
  conflict: 409
};

exports.jwtSecret = jwtSecret;
exports.code = code;