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
                done();
            });
        });
    });
});