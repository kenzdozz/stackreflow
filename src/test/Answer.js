/* global describe it beforeEach */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import Answer from '../Model/Answer';

const expect = chai.expect;
chai.use(chaiHttp);


describe('Answer', () => {
  beforeEach((done) => {
    Answer.empty((err) => {
      if (err) throw err;
      done();
    });
  });

  describe('POST /questions/:questionId/answers', () => {
    it('Should post answer to a question with id', (done) => {
      const question = {
        title: 'How can I test this test?',
        body: 'How will I write a test code to test my test codes on nodejs?',
        tags: 'test, test code',
      };
      const answer = {
        body: 'By writing test code to test the test code.',
      };
      const user = {
        email: 'kenzdozz@gmail.com',
        password: 'chidozie',
      };
      chai.request(app).post('/api/v1/auth/login').send(user)
        .end((error, response) => {
          question.token = response.body.token;

          chai.request(app).post('/api/v1/questions').send(question)
            .end((errr, ress) => {
              answer.token = response.body.token;
              const questionId = ress.body.question.id;
              chai.request(app).post(`/api/v1/questions/${questionId}/answers`).send(answer)
                .end((err, res) => {
                  const answerId = res.body.answer.id;

                  chai.request(app).put(`/api/v1/questions/${questionId}/answers/${answerId}`)
                    .send({ token: response.body.token }).end((er, re) => {
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
