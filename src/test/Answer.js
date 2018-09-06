/* global describe it before */
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


describe('Answer', () => {
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
  let answerId = null;

  before((done) => {
    Question.createTable(() => {
      Answer.createTable(() => {
        Answer.empty((error) => {
          if (error) throw error;
          Question.empty((errr) => {
            if (errr) throw errr;
            User.empty((err) => {
              if (err) throw err;

              newUser.save((data) => {
                user = data.user;
                newQuestion.userId = user.id;

                newQuestion.save((data2) => {
                  question = data2.question;

                  chai.request(app).post('/api/v1/auth/login')
                    .send({ email: 'kenzdozz@gmail.com', password: 'chidozie' })
                    .end((er, res) => {
                      token = res.body.token;
                      done();
                    });
                });
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
        token,
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
        .send({ token }).end((err, res) => {
          expect(res.statusCode, 'Should be 200').to.equal(200);
          expect(res.body, 'Should return object').to.be.a('object');
          done();
        });
    });
  });

  describe('PUT /questions/:questionId/answers/:answerId/upvote', () => {
    it('Should upvote an answer to a question', (done) => {
      chai.request(app).put(`/api/v1/questions/${question.id}/answers/${answerId}/upvote`)
        .send({ token }).end((err, res) => {
          expect(res.statusCode, 'Should be 200').to.equal(200);
          expect(res.body, 'Should return object').to.be.a('object');
          done();
        });
    });
  });

  describe('PUT /questions/:questionId/answers/:answerId/downvote', () => {
    it('Should downvote an answer to a question', (done) => {
      chai.request(app).put(`/api/v1/questions/${question.id}/answers/${answerId}/downvote`)
        .send({ token }).end((err, res) => {
          expect(res.statusCode, 'Should be 200').to.equal(200);
          expect(res.body, 'Should return object').to.be.a('object');
          done();
        });
    });
  });

  describe('DELETE /questions/:questionId/answers/:answerId', () => {
    it('Should delete an answer to a question', (done) => {
      chai.request(app).delete(`/api/v1/questions/${question.id}/answers/${answerId}`)
        .send({ token }).end((err, res) => {
          expect(res.statusCode, 'Should be 200').to.equal(200);
          expect(res.body, 'Should return object').to.be.a('object');
          done();
        });
    });
  });
});
