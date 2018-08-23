'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Question = require('../Model/Question');

var _Question2 = _interopRequireDefault(_Question);

var _config = require('../config');

var _Answer = require('../Model/Answer');

var _Answer2 = _interopRequireDefault(_Answer);

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

  if (!valid.status) return res.status(_config.code.badRequest).json(valid);

  var question = new _Question2.default();
  question.title = req.body.title.trim();
  question.body = req.body.body.trim();
  if (req.body.tags) question.tags = req.body.tags.trim();
  question.userId = res.locals.user.id;

  return question.save(function (data) {
    if (!data.status) return res.status(_config.code.serverError).json(_config.errMsg.serverError);
    return res.status(_config.code.ok).json(data);
  });
}

function getQuestion(req, res) {
  return _Question2.default.find(req.params.questionId, function (data) {
    if (!data.status) return res.status(_config.code.serverError).json(_config.errMsg.serverError);
    if (!data.question) return res.status(_config.code.notFound).json(_config.errMsg.notFound.question);
    return _Answer2.default.findForQuestion(data.question.id, function (data2) {
      if (!data2.status) return res.status(_config.code.serverError).json(_config.errMsg.serverError);
      var responseData = {
        status: true,
        question: data.question,
        answers: data2.answers
      };
      return res.status(_config.code.ok).json(responseData);
    });
  });
}

function getQuestions(req, res) {
  return _Question2.default.findAll(function (data) {
    if (!data.status) return res.status(_config.code.serverError).json(_config.errMsg.serverError);
    if (data.questions.length < 1) return res.status(_config.code.notFound).json(_config.errMsg.notFound.questions);
    return res.status(_config.code.ok).json(data);
  });
}

function deleteQuestion(req, res) {
  return _Question2.default.find(req.params.questionId, function (data) {
    if (!data.status) return res.status(_config.code.serverError).json(_config.errMsg.serverError);
    if (!data.question) return res.status(_config.code.notFound).json(_config.errMsg.notFound.question);
    if (data.question.userId !== res.locals.user.id) {
      return res.status(_config.code.unAuthorized).json(_config.errMsg.unAuthorized);
    }
    return _Question2.default.delete(req.params.questionId, function (data2) {
      if (!data2.status) return res.status(_config.code.serverError).json(_config.errMsg.serverError);
      return res.status(_config.code.ok).json(data2);
    });
  });
}

function questionRoutes(router) {
  router.post('/questions', postQuestion);
  router.get('/questions', getQuestions);
  router.get('/questions/:questionId', getQuestion);
  router.delete('/questions/:questionId', deleteQuestion);
}

exports.default = questionRoutes;