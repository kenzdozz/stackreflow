/* global describe it beforeEach */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import Question from '../Model/Question';
import Answer from '../Model/Answer';
import User from '../Model/User';

const expect = chai.expect;
chai.use(chaiHttp);

Question.createTable(data => { });
Answer.createTable(data => { });

describe('Answer', () => {

  let newQuestion = new Question();
  newQuestion.title = 'How can I test this test?';
  newQuestion.body = 'How will I write a test code to test my test codes on nodejs?';
  newQuestion.tags = 'test, test code';

  let newUser = new User();
  newUser.name = 'Kenneth';
  newUser.email = 'kenzdozz@gmail.com';
  newUser.password = 'chidozie';

  let user = null;
  let question = null;
  let token = null;
  let answerId = null;

  before(function (done) {

    Answer.empty((err) => {
      if (err) throw err;

      Question.empty((err) => {
        if (err) throw err;

        User.empty((err) => {
          if (err) throw err;

          newUser.save(data => {
            user = data.user;
            newQuestion.userId = user.id;

            newQuestion.save(data => {
              question = data.question;

              chai.request(app).post('/api/v1/auth/login')
                .send({ email: 'kenzdozz@gmail.com', password: 'chidozie', })
                .end((err, res) => {
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
    it('Should post answer to a question with id', (done) => {
      const answer = {
        body: 'By writing test code to test the test code.',
        token: token,
      };
      chai.request(app).post(`/api/v1/questions/${question.id}/answers`).send(answer)
        .end((err, res) => {
          answerId = res.body.answer.id;
          expect(res.statusCode, 'Should be 200').to.equal(200);
          expect(res.body, 'Should return object').to.be.a('object');
          done();
        });
    });
  });

  describe('PUT /questions/:questionId/answers/:answerId', () => {
    it('Should accept an answer to a question', (done) => {
      chai.request(app).put(`/api/v1/questions/${question.id}/answers/${answerId}`)
        .send({ token: token }).end((err, res) => {
          expect(res.statusCode, 'Should be 200').to.equal(200);
          expect(res.body, 'Should return object').to.be.a('object');
          done();
        });
    });
  });
});
