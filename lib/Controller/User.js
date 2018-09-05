'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../config');

var _User = require('../Model/User');

var _User2 = _interopRequireDefault(_User);

var _Question = require('../Model/Question');

var _Question2 = _interopRequireDefault(_Question);

var _Answer = require('../Model/Answer');

var _Answer2 = _interopRequireDefault(_Answer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getUser(req, res) {
  return _User2.default.find(req.params.id, data => {
    if (!data.status) {
      return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
    }
    if (!data.user) {
      return res.status(_config.code.notFound).json({ status: false, errors: 'User not found' });
    }
    const resData = data;
    delete resData.user.password;
    const sort = req.query.sort === 'top' ? 'top' : 'new';
    const type = req.query.type === 'answers' ? 'answers' : 'questions';
    if (type === 'answers') {
      return _Answer2.default.findForUser(resData.user.id, sort, data2 => {
        if (!data2.status) {
          return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
        }
        let question = null;
        data2.questions.forEach(aQuestion => {
          question = aQuestion;
          question.created = (0, _config.timeAgo)(question.created_at);
        });
        resData.user.questions = data2.questions;
        return res.status(_config.code.ok).json(resData);
      });
    }
    return _Question2.default.findForUser(resData.user.id, sort, data2 => {
      if (!data2.status) {
        return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
      }
      let question = null;
      data2.questions.forEach(aQuestion => {
        question = aQuestion;
        question.created = (0, _config.timeAgo)(question.created_at);
      });
      resData.user.questions = data2.questions;
      return res.status(_config.code.ok).json(resData);
    });
  });
}

function getUsers(req, res) {
  return _User2.default.findAll(data => {
    if (!data.status) {
      return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
    }
    if (data.users.length < 1) {
      return res.status(_config.code.notFound).json({ status: false, errors: 'There are no users' });
    }
    return res.status(_config.code.ok).json(data);
  });
}

function userRoutes(router) {
  router.get('/users/:id', getUser);
  router.get('/users', getUsers);
}

exports.default = userRoutes;