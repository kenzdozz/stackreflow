'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('../config');

var _User = require('../Model/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(user) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var msg = [];
  var status = true;

  if (!regex.test(user.email)) {
    msg.push('A valid email address is required.');
    status = false;
  }
  if (user.password === '') {
    msg.push('Password is required.');
    status = false;
  }
  return {
    status: status,
    message: JSON.stringify(msg)
  };
}

function login(req, res) {
  var user = {
    email: req.body.email.trim(),
    password: req.body.password
  };

  var valid = validate(user);

  if (!valid.status) {
    return res.status(_config.code.badRequest).json(valid);
  }

  return _User2.default.find(user.email, function (data) {
    if (!data.status) return res.status(_config.code.serverError).json('Internal server error');
    if (data.user && data.user.password && _bcrypt2.default.compareSync(user.password, data.user.password)) {
      var token = _jsonwebtoken2.default.sign({
        email: data.user.email,
        id: data.user.id
      }, _config.jwtSecret);
      return res.status(_config.code.ok).json({ token: token });
    }
    return res.status(_config.code.badRequest).json('Invalid email or password.');
  });
}

function loginRoutes(router) {
  router.post('/auth/login', login);
}

exports.default = loginRoutes;