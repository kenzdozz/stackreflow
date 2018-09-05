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

var _User3 = require('./Model/User');

var _User4 = _interopRequireDefault(_User3);

var _Question3 = require('./Model/Question');

var _Question4 = _interopRequireDefault(_Question3);

var _Answer3 = require('./Model/Answer');

var _Answer4 = _interopRequireDefault(_Answer3);

var _Vote = require('./Model/Vote');

var _Vote2 = _interopRequireDefault(_Vote);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();
app.use((0, _cookieParser2.default)());
const apiRouter = _express2.default.Router();

app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_express2.default.static(_path2.default.join(__dirname + '/public')));

app.use((req, res, next) => {
  res.locals.user = {};
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || 'none';
  return _jsonwebtoken2.default.verify(token, _config.jwtSecret, (err, data) => {
    if (err) {
      if (req.method === 'GET' || req.path === '/api/v1/auth/login' || req.path === '/api/v1/auth/signup') {
        res.locals.authCheck = false;
        return next();
      }
      return res.status(_config.code.unAuthorized).json({ status: false, errors: 'Unauthorized Access - invalid or no token' });
    }
    res.locals.user = data;
    res.locals.authCheck = true;
    return next();
  });
});

_Vote2.default.createTable(() => {});
_User4.default.createTable(() => {});
_Question4.default.createTable(() => {});
_Answer4.default.createTable(() => {});

app.use('/api/v1', apiRouter);
(0, _Register2.default)(apiRouter);
(0, _User2.default)(apiRouter);
(0, _Login2.default)(apiRouter);
(0, _Question2.default)(apiRouter);
(0, _Answer2.default)(apiRouter);

// viewed at http://localhost:8080
app.listen(3033);

exports.default = app;