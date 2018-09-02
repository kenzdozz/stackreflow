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
  const msg = {};
  let status = true;

  if (!req.body.body || req.body.body === '') {
    msg.body = 'Answer body is required.';
    status = false;
  }
  return {
    status,
    errors: msg
  };
}

function postAnswer(req, res) {
  const valid = validate(req);

  if (!valid.status) return res.status(_config.code.badRequest).json(valid);

  const answer = new _Answer2.default();
  answer.questionId = req.params.questionId;
  answer.body = req.body.body.trim();
  answer.userId = res.locals.user.id;

  return answer.save(data => {
    if (!data.status) {
      return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
    }
    const resData = data;
    _Question2.default.update(resData.answer.question_id, { answer_count: 1 }, data => {
      console.log(data);
    });
    resData.answer.created = (0, _config.timeAgo)(resData.answer.created_at);
    return res.status(_config.code.ok).json(resData);
  });
}

function acceptAnswer(req, res) {
  return _Question2.default.find(req.params.questionId, data => {
    if (!data.status) {
      return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
    }
    if (!data.question) {
      return res.status(_config.code.notFound).json({ status: false, errors: _config.errMsg.notFound.question });
    }
    if (data.question.user_id !== res.locals.user.id) {
      return res.status(_config.code.unAuthorized).json({ status: false, errors: _config.errMsg.unAuthorized });
    }
    return _Answer2.default.find(req.params.answerId, data2 => {
      if (!data2.status) {
        return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
      }
      if (!data2.answer) {
        return res.status(_config.code.notFound).json({ status: false, errors: _config.errMsg.notFound.answer });
      }
      return _Answer2.default.update(req.params.answerId, { accepted: true }, data3 => {
        if (!data3.status) {
          return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
        }
        return res.status(_config.code.ok).json({ status: true, message: 'Answer accepted' });
      });
    });
  });
}

function answerRoutes(router) {
  router.post('/questions/:questionId/answers', postAnswer);
  router.put('/questions/:questionId/answers/:answerId', acceptAnswer);
}

exports.default = answerRoutes;