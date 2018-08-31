'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect; /* global describe it */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */

_chai2.default.use(_chaiHttp2.default);

describe('Authentication', function () {
  describe('POST /auth/login', function () {
    it('Should send login and return token', function (done) {
      var user = {
        email: 'kenzdozz@gmail.com',
        password: 'chidozie'
      };
      _chai2.default.request(_app2.default).post('/api/v1/auth/login').send(user).end(function (err, res) {
        expect(res.statusCode, 'Should be 400').to.equal(200);
        expect(res.body, 'Should return object').to.be.a('object');
        done();
      });
    });
    it('Should fail to login', function (done) {
      var user = {
        email: 'kenzdozz@gmail.com',
        password: 'chidozi'
      };
      _chai2.default.request(_app2.default).post('/api/v1/auth/login').send(user).end(function (err, res) {
        expect(res.statusCode, 'Should be 400').to.equal(400);
        expect(res.body, 'Should return object').to.be.a('object');
        expect(res.body.errors.email, 'Should return Invalid email or password.').to.eql('Invalid email or password.');
        done();
      });
    });
  });

  describe('POST /auth/signup', function () {
    it('Should register a user', function (done) {
      var user = {
        email: 'kenzdozz@reddit.com',
        password: 'chidozie',
        name: 'Kenneth Chidozie'
      };
      _chai2.default.request(_app2.default).post('/api/v1/auth/signup').send(user).end(function (err, res) {
        expect(res.statusCode, 'Should be 200').to.equal(200);
        expect(res.body, 'Should return object').to.be.a('object');
        done();
      });
    });
  });
});