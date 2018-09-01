'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _Answer = require('../Model/Answer');

var _Answer2 = _interopRequireDefault(_Answer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global describe it beforeEach */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
var expect = _chai2.default.expect;
_chai2.default.use(_chaiHttp2.default);

describe('Answer', function () {

  _Answer2.default.createTable(function (data) {});

  beforeEach(function (done) {
    _Answer2.default.empty(function (err) {
      if (err) throw err;
      done();
    });
  });

  describe('POST /questions/:questionId/answers', function () {
    it('Should post answer to a question with id', function (done) {
      var question = {
        title: 'How can I test this test?',
        body: 'How will I write a test code to test my test codes on nodejs?',
        tags: 'test, test code'
      };
      var answer = {
        body: 'By writing test code to test the test code.'
      };
      var user = {
        email: 'kenzdozz@gmail.com',
        password: 'chidozie'
      };
      _chai2.default.request(_app2.default).post('/api/v1/auth/login').send(user).end(function (error, response) {
        question.token = response.body.token;

        _chai2.default.request(_app2.default).post('/api/v1/questions').send(question).end(function (errr, ress) {
          answer.token = response.body.token;
          var questionId = ress.body.question.id;
          _chai2.default.request(_app2.default).post('/api/v1/questions/' + questionId + '/answers').send(answer).end(function (err, res) {
            var answerId = res.body.answer.id;

            _chai2.default.request(_app2.default).put('/api/v1/questions/' + questionId + '/answers/' + answerId).send({ token: response.body.token }).end(function (er, re) {
              expect(re.statusCode, 'Should be 200').to.equal(200);
              expect(re.body, 'Should return object').to.be.a('object');
              done();
            });
          });
        });
      });
    });
  });
});