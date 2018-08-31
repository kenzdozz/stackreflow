/* global describe it */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-destructuring */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const expect = chai.expect;
chai.use(chaiHttp);


describe('Users', () => {
  describe('GET /users', () => {
    it('Should get all users', (done) => {
      const user = {
        email: 'kenzdozz@gmail.com',
        password: 'chidozie',
      };
      chai.request(app).post('/api/v1/auth/login').send(user)
        .end((error, response) => {
          chai.request(app).get('/api/v1/users').send({ token: response.body.token })
            .end((err, res) => {
              expect(res.statusCode, 'Should be 200').to.equal(200);
              expect(res.body, 'Should return object').to.be.a('object');
              expect(res.body.users, 'Should return array').to.be.a('array');

              chai.request(app).get(`/api/v1/users/${res.body.users[0].id}`).send({ token: response.body.token })
                .end((errr, ress) => {
                  expect(ress.statusCode, 'Should be 200').to.equal(200);
                  expect(ress.body.user, 'Should return object').to.be.a('object');
                  done();
                });
            });
        });
    });
  });
});
