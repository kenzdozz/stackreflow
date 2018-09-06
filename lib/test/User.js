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

/* global describe it before */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
const expect = _chai2.default.expect;
_chai2.default.use(_chaiHttp2.default);

_User2.default.createTable(() => {});

describe('Users', () => {
  const newUser = new _User2.default();
  newUser.name = 'Kenneth';
  newUser.email = 'kenzdozz@gmail.com';
  newUser.password = 'chidozie';

  let user = null;
  let token = null;

  before(done => {
    _User2.default.empty(err => {
      if (err) throw err;

      newUser.save(data => {
        user = data.user;

        _chai2.default.request(_app2.default).post('/api/v1/auth/login').send({ email: 'kenzdozz@gmail.com', password: 'chidozie' }).end((error, res) => {
          token = res.body.token;
          done();
        });
      });
    });
  });

  describe('GET /users', () => {
    it('Should get all users', done => {
      _chai2.default.request(_app2.default).get('/api/v1/users').send({ token }).end((err, res) => {
        expect(res.statusCode, 'Should be 200').to.equal(200);
        expect(res.body, 'Should return object').to.be.a('object');
        expect(res.body.users, 'Should return array').to.be.a('array');
        done();
      });
    });
  });

  describe('GET /users/:userId', () => {
    it('Should get one user with questions', done => {
      _chai2.default.request(_app2.default).get(`/api/v1/users/${user.id}`).send({ token }).end((errr, res) => {
        expect(res.statusCode, 'Should be 200').to.equal(200);
        expect(res.body.user, 'Should return object').to.be.a('object');
        expect(res.body.user.questions, 'Should return array').to.be.a('array');
        done();
      });
    });
    it('Should get one user and sort questions by most response', done => {
      _chai2.default.request(_app2.default).get(`/api/v1/users/${user.id}?sort=top`).send({ token }).end((errr, res) => {
        expect(res.statusCode, 'Should be 200').to.equal(200);
        expect(res.body.user, 'Should return object').to.be.a('object');
        expect(res.body.user.questions, 'Should return array').to.be.a('array');
        done();
      });
    });
    it('Should get one user and questions user has given answer to', done => {
      _chai2.default.request(_app2.default).get(`/api/v1/users/${user.id}?type=answers`).send({ token }).end((errr, res) => {
        expect(res.statusCode, 'Should be 200').to.equal(200);
        expect(res.body.user, 'Should return object').to.be.a('object');
        expect(res.body.user.questions, 'Should return array').to.be.a('array');
        done();
      });
    });
  });
});