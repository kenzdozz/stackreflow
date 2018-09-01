'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _User = require('../Model/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global describe it */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
var expect = _chai2.default.expect;
_chai2.default.use(_chaiHttp2.default);

_User2.default.createTable(function (data) {});

describe('Users', function () {
  describe('GET /users', function () {
    it('Should get all users', function (done) {
      var user = {
        email: 'kenzdozz@gmail.com',
        password: 'chidozie'
      };
      _chai2.default.request(_app2.default).post('/api/v1/auth/login').send(user).end(function (error, response) {
        _chai2.default.request(_app2.default).get('/api/v1/users').send({ token: response.body.token }).end(function (err, res) {
          expect(res.statusCode, 'Should be 200').to.equal(200);
          expect(res.body, 'Should return object').to.be.a('object');
          expect(res.body.users, 'Should return array').to.be.a('array');

          _chai2.default.request(_app2.default).get('/api/v1/users/' + res.body.users[0].id).send({ token: response.body.token }).end(function (errr, ress) {
            expect(ress.statusCode, 'Should be 200').to.equal(200);
            expect(ress.body.user, 'Should return object').to.be.a('object');
            done();
          });
        });
      });
    });
  });
});