'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _Register = require('./Controller/Register');

var _Register2 = _interopRequireDefault(_Register);

var _User = require('./Controller/User');

var _User2 = _interopRequireDefault(_User);

var _Login = require('./Controller/Login');

var _Login2 = _interopRequireDefault(_Login);

var _config = require('./config');

var _Question = require('./Controller/Question');

var _Question2 = _interopRequireDefault(_Question);

var _Answer = require('./Controller/Answer');

var _Answer2 = _interopRequireDefault(_Answer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use((0, _cookieParser2.default)());
var apiRouter = _express2.default.Router();

app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));

app.use('/api/v1/questions', function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || 'none';
  return _jsonwebtoken2.default.verify(token, _config.jwtSecret, function (err, data) {
    if (err) {
      if (req.method === 'GET') {
        res.locals.authCheck = false;
        return next();
      }
      return res.status(_config.code.unAuthorized).json('Unauthorized Access - invalid or no token');
    }
    res.locals.user = data;
    res.locals.authCheck = true;
    return next();
  });
});

app.use(_express2.default.static(__dirname + '/public'));

app.use('/api/v1', apiRouter);
(0, _Register2.default)(apiRouter);
(0, _User2.default)(apiRouter);
(0, _Login2.default)(apiRouter);
(0, _Question2.default)(apiRouter);
(0, _Answer2.default)(apiRouter);

app.listen(3033);

exports.default = app;