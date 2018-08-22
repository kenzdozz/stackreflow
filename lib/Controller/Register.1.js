'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _User = require('../Model/User');

var User = _interopRequireWildcard(_User);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
  var user = {
    name: req.body.name.trim(),
    email: req.body.email.trim(),
    password: req.body.password
  };

  var valid = validate(user);

  if (!valid.status) {
    return res.json(valid);
  }

  return User.createUser(user, function (data) {
    return res.json(data);
  });
}

function registerRoutes(router) {
  router.post('/auth/signup', createUser);
}

exports.default = registerRoutes;