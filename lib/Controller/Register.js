'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
  if (user.name === '') {
    msg.push('Display name is required.');
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

function createUser(req, res) {
  var user = new _User2.default();
  user.name = req.body.name.trim();
  user.email = req.body.email.trim();
  user.password = req.body.password;

  var valid = validate(user);

  if (!valid.status) {
    return res.json(valid);
  }

  return user.save(function (data) {
    return res.json(data);
  });
}

function registerRoutes(router) {
  router.post('/auth/signup', createUser);
}

exports.default = registerRoutes;