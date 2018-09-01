/* global describe it */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import User from '../Model/User';

const expect = chai.expect;
chai.use(chaiHttp);

describe('Users', () => {

  let newUser = new User();
  newUser.name = 'Kenneth';
  newUser.email = 'kenzdozz@gmail.com';
  newUser.password = 'chidozie';

  let user = null;
  let token = null;

  before(function (done) {
    User.createTable(data => {
      User.empty((err) => {
        if (err) throw err;
        newUser.save(data => {
          user = data.user;
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

  describe('GET /users', () => {
    it('Should get all users', (done) => {

      chai.request(app).get('/api/v1/users').send({ token })
        .end((err, res) => {
          expect(res.statusCode, 'Should be 200').to.equal(200);
          expect(res.body, 'Should return object').to.be.a('object');
          expect(res.body.users, 'Should return array').to.be.a('array');
          done();
        });
    });
  });

  describe('GET /users/:userId', () => {
    it('Should get one user', (done) => {

      chai.request(app).get(`/api/v1/users/${user.id}`).send({ token })
        .end((errr, res) => {
          expect(res.statusCode, 'Should be 200').to.equal(200);
          expect(res.body.user, 'Should return object').to.be.a('object');
          done();
        });
    });
  });
});
