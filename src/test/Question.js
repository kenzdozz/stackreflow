/* global describe it beforeEach */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import Question from '../Model/Question';

const expect = chai.expect;
chai.use(chaiHttp);


describe('Question', () => {
  beforeEach((done) => {
    Question.empty((err) => {
      if (err) throw err;
      done();
    });
  });

  describe('GET /questions', () => {
    it('Should get all questions', (done) => {
      chai.request(app).get('/api/v1/questions')
        .end((err, res) => {
          expect(res.statusCode, 'Should be 200').to.equal(200);
          expect(res.body.questions, 'Should return array').to.be.a('array');
          expect(res.body.questions.length, 'Should return no questions').to.be.equal(0);
          done();
        });
    });
  });

  describe('POST /questions', () => {
    it('Should not post a question without title', (done) => {
      const question = {
        body: 'How will I write a test code to test my test codes on nodejs?',
        tags: 'test, test code',
      };
      const user = {
        email: 'kenzdozz@gmail.com',
        password: 'chidozie',
      };
      chai.request(app).post('/api/v1/auth/login').send(user)
        .end((error, response) => {
          question.token = response.body.token;
          chai.request(app).post('/api/v1/questions').send(question)
            .end((err, res) => {
              expect(res.statusCode, 'Should be 400').to.equal(400);
              expect(res.body, 'Should return object').to.be.a('object');
              expect(res.body.errors.title, 'Should require title').to.eql('Question title is required. ');
              done();
            });
        });
    });

    it('Should post a question', (done) => {
      const question = {
        title: 'How can I test this test?',
        body: 'How will I write a test code to test my test codes on nodejs?',
        tags: 'test, test code',
      };
      const user = {
        email: 'kenzdozz@gmail.com',
        password: 'chidozie',
      };
      chai.request(app).post('/api/v1/auth/login').send(user)
        .end((error, response) => {
          question.token = response.body.token;
          chai.request(app).post('/api/v1/questions').send(question)
            .end((err, res) => {
              expect(res.statusCode, 'Should be 200').to.equal(200);
              expect(res.body.question, 'Should return object').to.be.a('object');
              expect(res.body.question, 'Should have property id').to.have.property('id');
              done();
            });
        });
    });
  });

  describe('GET /questions/:questionId', () => {
    it('Should get a question', (done) => {
      const question = new Question();
      question.title = 'How can I test this test?';
      question.body = 'How will I write a test code to test my test codes on nodejs?';
      question.tags = 'test, test code';
      question.userId = 8;
      question.save((data) => {
        chai.request(app).get(`/api/v1/questions/${data.question.id}`)
          .end((err, res) => {
            expect(res.statusCode, 'Should be 200').to.equal(200);
            expect(res.body.question, 'Should return object').to.be.a('object');
            expect(res.body.question, 'Should have property title').to.have.property('title');
            done();
          });
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
      const user = {
        email: 'kenzdozz@gmail.com',
        password: 'chidozie',
      };
      chai.request(app).post('/api/v1/auth/login').send(user)
        .end((error, response) => {
          const question = new Question();
          question.title = 'How can I test this test?';
          question.body = 'How will I write a test code to test my test codes on nodejs?';
          question.tags = 'test, test code';
          question.userId = response.body.user.id;
          question.save((data) => {
            chai.request(app).delete(`/api/v1/questions/${data.question.id}`)
              .send({ token: response.body.token })
              .end((err, res) => {
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
