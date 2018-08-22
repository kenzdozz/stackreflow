'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../config');

var _User = require('../Model/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getUser(req, res) {
  return _User2.default.find(req.params.id, function (data) {
    if (!data.status) return res.status(_config.code.serverError).json('Internal server error');
    if (!data.user) return res.status(_config.code.notFound).json('User not found');
    return res.json(data);
  });
}

function getUsers(req, res) {
  return _User2.default.findAll(function (data) {
    if (!data.status) return res.status(_config.code.serverError).json('Internal server error');
    if (data.users.length < 1) return res.status(_config.code.notFound).json('There are no users');
    return res.json(data);
  });
}

function userRoutes(router) {
  router.get('/user/:id', getUser);
  router.get('/users', getUsers);
}

exports.default = userRoutes;