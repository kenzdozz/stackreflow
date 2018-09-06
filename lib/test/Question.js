'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _Question = require('../Model/Question');

var _Question2 = _interopRequireDefault(_Question);

var _User = require('../Model/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const expect = _chai2.default.expect; /* global describe it beforeEach */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */

_chai2.default.use(_chaiHttp2.default);

_User2.default.createTable(() => {});
_Question2.default.createTable(() => {});

describe('Question', () => {
  const newQuestion = new _Question2.default();
  newQuestion.title = 'How can I test this test?';
  newQuestion.body = 'How will I write a test code to test my test codes on nodejs?';
  newQuestion.tags = 'test, test code';

  const newUser = new _User2.default();
  newUser.name = 'Kenneth';
  newUser.email = 'kenzdozz@gmail.com';
  newUser.password = 'chidozie';

  let user = null;
  let question = null;
  let token = null;

  beforeEach(done => {
    _Question2.default.empty(err => {
      if (err) throw err;

      _User2.default.empty(error => {
        if (error) throw error;

        newUser.save(data => {
          user = data.user;
          newQuestion.userId = user.id;

          newQuestion.save(data2 => {
            question = data2.question;

            _chai2.default.request(_app2.default).post('/api/v1/auth/login').send({ email: 'kenzdozz@gmail.com', password: 'chidozie' }).end((errr, res) => {
              token = res.body.token;
              done();
            });
          });
        });
      });
    });
  });

  describe('GET /questions', () => {
    it('Should get all questions', done => {
      _chai2.default.request(_app2.default).get('/api/v1/questions').end((err, res) => {
        expect(res.statusCode, 'Should be 200').to.equal(200);
        expect(res.body.questions, 'Should return array').to.be.a('array');
        expect(res.body.questions.length, 'Should return one question').to.be.equal(1);
        done();
      });
    });
    it('Should get search questions', done => {
      _chai2.default.request(_app2.default).get('/api/v1/questions?search=test').end((err, res) => {
        expect(res.statusCode, 'Should be 200').to.equal(200);
        expect(res.body.questions, 'Should return array').to.be.a('array');
        done();
      });
    });
  });

  describe('POST /questions', () => {
    it('Should not post a question without title', done => {
      const aQuestion = {
        body: 'How will I write a test code to test my test codes on nodejs?',
        tags: 'test, test code',
        user_id: user.id,
        token
      };
      _chai2.default.request(_app2.default).post('/api/v1/questions').send(aQuestion).end((err, res) => {
        expect(res.statusCode, 'Should be 400').to.equal(400);
        expect(res.body, 'Should return object').to.be.a('object');
        expect(res.body.errors.title, 'Should require title').to.eql('Question title is required. ');
        done();
      });
    });

    it('Should post a question', done => {
      const aQuestion = {
        title: 'How can I test another test?',
        body: 'How will I write a test code to test my test codes on nodejs?',
        tags: 'test, test code',
        user_id: user.id,
        token
      };
      _chai2.default.request(_app2.default).post('/api/v1/questions').send(aQuestion).end((err, res) => {
        expect(res.statusCode, 'Should be 200').to.equal(200);
        expect(res.body.question, 'Should return object').to.be.a('object');
        expect(res.body.question, 'Should have property id').to.have.property('id');
        done();
      });
    });
  });

  describe('GET /questions/:questionId', () => {
    it('Should get a question', done => {
      _chai2.default.request(_app2.default).get(`/api/v1/questions/${question.id}`).end((err, res) => {
        expect(res.statusCode, 'Should be 200').to.equal(200);
        expect(res.body.question, 'Should return object').to.be.a('object');
        expect(res.body.question, 'Should have property title').to.have.property('title');
        done();
      });
    });
    it('Should not get a question with id 2333', done => {
      _chai2.default.request(_app2.default).get('/api/v1/questions/2333').end((err, res) => {
        expect(res.statusCode, 'Should be 200').to.equal(200);
        expect(res.body.question, 'Should return object').to.be.a('object');
        expect(res.body.question, 'Should have property title').not.to.have.property('title');
        done();
      });
    });
  });

  describe('DELETE /questions/:questionId', () => {
    it('Should delete a question', done => {
      _chai2.default.request(_app2.default).delete(`/api/v1/questions/${question.id}`).send({ token }).end((err, res) => {
        expect(res.statusCode, 'Should be 200').to.equal(200);
        expect(res.body.question, 'Should return object').to.be.a('object');
        expect(res.body.question, 'Should not have property title').not.to.have.property('title');
        done();
      });
    });
  });
});