'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _Question = require('../Model/Question');

var _Question2 = _interopRequireDefault(_Question);

var _Answer = require('../Model/Answer');

var _Answer2 = _interopRequireDefault(_Answer);

var _User = require('../Model/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global describe it beforeEach */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
const expect = _chai2.default.expect;
_chai2.default.use(_chaiHttp2.default);

_Answer2.default.createTable(data => {});
_Question2.default.createTable(data => {});

describe('Answer', () => {

  let newQuestion = new _Question2.default();
  newQuestion.title = 'How can I test this test?';
  newQuestion.body = 'How will I write a test code to test my test codes on nodejs?';
  newQuestion.tags = 'test, test code';

  let newUser = new _User2.default();
  newUser.name = 'Kenneth';
  newUser.email = 'kenzdozz@gmail.com';
  newUser.password = 'chidozie';

  let user = null;
  let question = null;
  let token = null;
  let answerId = null;

  before(function (done) {

    _Question2.default.empty(err => {
      if (err) throw err;

      _Answer2.default.empty(err => {
        if (err) throw err;

        _User2.default.empty(err => {
          if (err) throw err;

          newUser.save(data => {
            user = data.user;
            newQuestion.userId = user.id;

            newQuestion.save(data => {
              question = data.question;

              _chai2.default.request(_app2.default).post('/api/v1/auth/login').send({ email: 'kenzdozz@gmail.com', password: 'chidozie' }).end((err, res) => {
                token = res.body.token;
                done();
              });
            });
          });
        });
      });
    });
  });

  describe('POST /questions/:questionId/answers', () => {
    it('Should post answer to a question with id', done => {
      const answer = {
        body: 'By writing test code to test the test code.',
        token: token
      };
      _chai2.default.request(_app2.default).post(`/api/v1/questions/${question.id}/answers`).send(answer).end((err, res) => {
        answerId = res.body.answer.id;
        expect(res.statusCode, 'Should be 200').to.equal(200);
        expect(res.body, 'Should return object').to.be.a('object');
        done();
      });
    });
  });

  describe('PUT /questions/:questionId/answers/:answerId', () => {
    it('Should accept an answer to a question', done => {
      _chai2.default.request(_app2.default).put(`/api/v1/questions/${question.id}/answers/${answerId}`).send({ token: token }).end((err, res) => {
        expect(res.statusCode, 'Should be 200').to.equal(200);
        expect(res.body, 'Should return object').to.be.a('object');
        done();
      });
    });
  });
});