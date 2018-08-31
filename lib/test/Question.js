'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _Question = require('../Model/Question');

var _Question2 = _interopRequireDefault(_Question);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global describe it beforeEach */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
var expect = _chai2.default.expect;
_chai2.default.use(_chaiHttp2.default);

describe('Question', function () {
  beforeEach(function (done) {
    _Question2.default.empty(function (err) {
      if (err) throw err;
      done();
    });
  });

  describe('GET /questions', function () {
    it('Should get all questions', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/questions').end(function (err, res) {
        expect(res.statusCode, 'Should be 200').to.equal(200);
        expect(res.body.questions, 'Should return array').to.be.a('array');
        expect(res.body.questions.length, 'Should return no questions').to.be.equal(0);
        done();
      });
    });
  });

  describe('POST /questions', function () {
    it('Should not post a question without title', function (done) {
      var question = {
        body: 'How will I write a test code to test my test codes on nodejs?',
        tags: 'test, test code'
      };
      var user = {
        email: 'kenzdozz@gmail.com',
        password: 'chidozie'
      };
      _chai2.default.request(_app2.default).post('/api/v1/auth/login').send(user).end(function (error, response) {
        question.token = response.body.token;
        _chai2.default.request(_app2.default).post('/api/v1/questions').send(question).end(function (err, res) {
          expect(res.statusCode, 'Should be 400').to.equal(400);
          expect(res.body, 'Should return object').to.be.a('object');
          expect(res.body.errors.title, 'Should require title').to.eql('Question title is required. ');
          done();
        });
      });
    });

    it('Should post a question', function (done) {
      var question = {
        title: 'How can I test this test?',
        body: 'How will I write a test code to test my test codes on nodejs?',
        tags: 'test, test code'
      };
      var user = {
        email: 'kenzdozz@gmail.com',
        password: 'chidozie'
      };
      _chai2.default.request(_app2.default).post('/api/v1/auth/login').send(user).end(function (error, response) {
        question.token = response.body.token;
        _chai2.default.request(_app2.default).post('/api/v1/questions').send(question).end(function (err, res) {
          expect(res.statusCode, 'Should be 200').to.equal(200);
          expect(res.body.question, 'Should return object').to.be.a('object');
          expect(res.body.question, 'Should have property id').to.have.property('id');
          done();
        });
      });
    });
  });

  describe('GET /questions/:questionId', function () {
    it('Should get a question', function (done) {
      var question = new _Question2.default();
      question.title = 'How can I test this test?';
      question.body = 'How will I write a test code to test my test codes on nodejs?';
      question.tags = 'test, test code';
      question.userId = 8;
      question.save(function (data) {
        _chai2.default.request(_app2.default).get('/api/v1/questions/' + data.question.id).end(function (err, res) {
          expect(res.statusCode, 'Should be 200').to.equal(200);
          expect(res.body.question, 'Should return object').to.be.a('object');
          expect(res.body.question, 'Should have property title').to.have.property('title');
          done();
        });
      });
    });
    it('Should not get a question with id 2333', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/questions/2333').end(function (err, res) {
        expect(res.statusCode, 'Should be 200').to.equal(200);
        expect(res.body.question, 'Should return object').to.be.a('object');
        expect(res.body.question, 'Should have property title').not.to.have.property('title');
        done();
      });
    });
  });

  describe('DELETE /questions/:questionId', function () {
    it('Should delete a question', function (done) {
      var user = {
        email: 'kenzdozz@gmail.com',
        password: 'chidozie'
      };
      _chai2.default.request(_app2.default).post('/api/v1/auth/login').send(user).end(function (error, response) {
        var question = new _Question2.default();
        question.title = 'How can I test this test?';
        question.body = 'How will I write a test code to test my test codes on nodejs?';
        question.tags = 'test, test code';
        question.userId = response.body.user.id;
        question.save(function (data) {
          _chai2.default.request(_app2.default).delete('/api/v1/questions/' + data.question.id).send({ token: response.body.token }).end(function (err, res) {
            expect(res.statusCode, 'Should be 200').to.equal(200);
            expect(res.body.question, 'Should return object').to.be.a('object');
            expect(res.body.question, 'Should not have property title').not.to.have.property('title');
            done();
          });
        });
      });
    });
  });
});