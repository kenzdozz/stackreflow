/* global describe it */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import User from '../Model/User';

const expect = chai.expect;
chai.use(chaiHttp);

User.createTable(data => {});

describe('Authentication', () => {
  describe('POST /auth/login', () => {
    it('Should send login and return token', (done) => {
      const user = {
        email: 'kenzdozz@gmail.com',
        password: 'chidozie',
      };
      chai.request(app).post('/api/v1/auth/login').send(user)
        .end((err, res) => {
          expect(res.statusCode, 'Should be 400').to.equal(200);
          expect(res.body, 'Should return object').to.be.a('object');
          done();
        });
    });
    it('Should fail to login', (done) => {
      const user = {
        email: 'kenzdozz@gmail.com',
        password: 'chidozi',
      };
      chai.request(app).post('/api/v1/auth/login').send(user)
        .end((err, res) => {
          expect(res.statusCode, 'Should be 400').to.equal(400);
          expect(res.body, 'Should return object').to.be.a('object');
          expect(res.body.errors.email, 'Should return Invalid email or password.').to.eql('Invalid email or password.');
          done();
        });
    });
  });

  describe('POST /auth/signup', () => {
    it('Should register a user', (done) => {
      const user = {
        email: 'kenzdozz@reddit.com',
        password: 'chidozie',
        name: 'Kenneth Chidozie',
      };
      chai.request(app).post('/api/v1/auth/signup').send(user)
        .end((err, res) => {
          expect(res.statusCode, 'Should be 200').to.equal(200);
          expect(res.body, 'Should return object').to.be.a('object');
          done();
        });
    });
  });
});
