'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Question = require('../Model/Question');

var _Question2 = _interopRequireDefault(_Question);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(req) {
  var msg = [];
  var status = true;

  if (!req.body.title || req.body.title === '') {
    msg.push('Question title is required.');
    status = false;
  }
  if (!req.body.body || req.body.body === '') {
    msg.push('Question body is required.');
    status = false;
  }
  return {
    status: status,
    message: JSON.stringify(msg)
  };
}

function postQuestion(req, res) {
  var valid = validate(req);

  if (!valid.status) {
    return res.status(_config.code.badRequest).json(valid);
  }

  var question = new _Question2.default();
  question.title = req.body.title.trim();
  question.body = req.body.body.trim();
  if (req.body.tags) question.tags = req.body.tags.trim();
  question.userId = res.locals.user.id;

  return question.save(function (data) {
    return res.status(_config.code.ok).json(data);
  });
}

// function getQuestions(req, res) {

// }

function questionRoutes(router) {
  router.post('/questions', postQuestion);
}

exports.default = questionRoutes;