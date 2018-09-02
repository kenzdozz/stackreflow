/* global describe it beforeEach */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import Question from '../Model/Question';
import User from '../Model/User';

const expect = chai.expect;
chai.use(chaiHttp);

User.createTable(() => { });
Question.createTable(() => { });

describe('Question', () => {
  const newQuestion = new Question();
  newQuestion.title = 'How can I test this test?';
  newQuestion.body = 'How will I write a test code to test my test codes on nodejs?';
  newQuestion.tags = 'test, test code';

  const newUser = new User();
  newUser.name = 'Kenneth';
  newUser.email = 'kenzdozz@gmail.com';
  newUser.password = 'chidozie';

  let user = null;
  let question = null;
  let token = null;

  beforeEach((done) => {
    Question.empty((err) => {
      if (err) throw err;

      User.empty((error) => {
        if (error) throw error;

        newUser.save((data) => {
          user = data.user;
          newQuestion.userId = user.id;

          newQuestion.save((data2) => {
            question = data2.question;

            chai.request(app).post('/api/v1/auth/login')
              .send({ email: 'kenzdozz@gmail.com', password: 'chidozie' })
              .end((errr, res) => {
                token = res.body.token;
                done();
              });
          });
        });
      });
    });
  });

  describe('GET /questions', () => {
    it('Should get all questions', (done) => {
      chai.request(app).get('/api/v1/questions')
        .end((err, res) => {
          expect(res.statusCode, 'Should be 200').to.equal(200);
          expect(res.body.questions, 'Should return array').to.be.a('array');
          expect(res.body.questions.length, 'Should return one question').to.be.equal(1);
          done();
        });
    });
  });

  describe('POST /questions', () => {
    it('Should not post a question without title', (done) => {
      const aQuestion = {
        body: 'How will I write a test code to test my test codes on nodejs?',
        tags: 'test, test code',
        user_id: user.id,
        token,
      };
      chai.request(app).post('/api/v1/questions').send(aQuestion)
        .end((err, res) => {
          expect(res.statusCode, 'Should be 400').to.equal(400);
          expect(res.body, 'Should return object').to.be.a('object');
          expect(res.body.errors.title, 'Should require title').to.eql('Question title is required. ');
          done();
        });
    });

    it('Should post a question', (done) => {
      const aQuestion = {
        title: 'How can I test another test?',
        body: 'How will I write a test code to test my test codes on nodejs?',
        tags: 'test, test code',
        user_id: user.id,
        token,
      };
      chai.request(app).post('/api/v1/questions').send(aQuestion)
        .end((err, res) => {
          expect(res.statusCode, 'Should be 200').to.equal(200);
          expect(res.body.question, 'Should return object').to.be.a('object');
          expect(res.body.question, 'Should have property id').to.have.property('id');
          done();
        });
    });
  });

  describe('GET /questions/:questionId', () => {
    it('Should get a question', (done) => {
      chai.request(app).get(`/api/v1/questions/${question.id}`)
        .end((err, res) => {
          expect(res.statusCode, 'Should be 200').to.equal(200);
          expect(res.body.question, 'Should return object').to.be.a('object');
          expect(res.body.question, 'Should have property title').to.have.property('title');
          done();
        });
    });
    it('Should not get a question with id 2333', (done) => {
      chai.request(app).get('/api/v1/questions/2333')
        .end((err, res) => {
          expect(res.statusCode, 'Should be 200').to.equal(200);
          expect(res.body.question, 'Should return object').to.be.a('object');
          expect(res.body.question, 'Should have property title').not.to.have.property('title');
          done();
        });
    });
  });

  describe('DELETE /questions/:questionId', () => {
    it('Should delete a question', (done) => {
      chai.request(app).delete(`/api/v1/questions/${question.id}`)
        .send({ token })
        .end((err, res) => {
          expect(res.statusCode, 'Should be 200').to.equal(200);
          expect(res.body.question, 'Should return object').to.be.a('object');
          expect(res.body.question, 'Should not have property title').not.to.have.property('title');
          done();
        });
    });
  });
});
