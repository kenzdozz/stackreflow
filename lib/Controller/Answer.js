'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Question = require('../Model/Question');

var _Question2 = _interopRequireDefault(_Question);

var _config = require('../config');

var _Answer = require('../Model/Answer');

var _Answer2 = _interopRequireDefault(_Answer);

var _Vote = require('../Model/Vote');

var _Vote2 = _interopRequireDefault(_Vote);

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
    _Question2.default.update(resData.answer.question_id, { answer_count: 1 }, () => {});
    resData.answer.created = (0, _config.timeAgo)(resData.answer.created_at);
    return res.status(_config.code.ok).json(resData);
  });
}

function acceptAnswer(req, res) {
  const qId = req.params.questionId;
  const aId = req.params.answerId;
  return _Question2.default.find(qId, data => {
    if (!data.status) {
      return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
    }
    if (!data.question) {
      return res.status(_config.code.notFound).json({ status: false, errors: _config.errMsg.notFound.question });
    }
    if (data.question.user_id !== res.locals.user.id) {
      return res.status(_config.code.unAuthorized).json({ status: false, errors: _config.errMsg.unAuthorized });
    }
    return _Answer2.default.find(aId, data2 => {
      if (!data2.status) {
        return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
      }
      if (!data2.answer) {
        return res.status(_config.code.notFound).json({ status: false, errors: _config.errMsg.notFound.answer });
      }
      const accepted = !data2.answer.accepted;
      return _Answer2.default.rejectAnswers(qId, () => _Answer2.default.update(aId, { accepted }, data3 => {
        if (!data3.status) {
          return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
        }
        return _Question2.default.update(qId, { answered: accepted }, () => res.status(_config.code.ok).json({ status: true, message: 'Answer accepted' }));
      }));
    });
  });
}

function deleteAnswer(req, res) {
  return _Answer2.default.find(req.params.answerId, data => {
    if (!data.status) {
      return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
    }
    if (!data.answer) {
      return res.status(_config.code.ok).json({ status: false, errors: _config.errMsg.notFound.answer });
    }
    if (data.answer.user_id !== res.locals.user.id) {
      return res.status(_config.code.unAuthorized).json({ status: false, errors: _config.errMsg.unAuthorized });
    }
    return _Answer2.default.delete(req.params.answerId, data2 => {
      if (!data2.status) {
        return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
      }
      _Question2.default.update(data.answer.question_id, { answer_count: -1 }, () => {});
      return res.status(_config.code.ok).json(data2);
    });
  });
}

function upVoteAnswer(req, res) {
  const aId = req.params.answerId;
  const userId = res.locals.user.id;

  return _Vote2.default.find(userId, aId, data => {
    if (!data.status) {
      return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
    }
    if (data.vote && data.vote.vote === 1) {
      return _Vote2.default.delete(data.vote.id, () => _Answer2.default.update(aId, { voteCount: -1 }, () => {}));
    }if (data.vote && data.vote.vote === -1) {
      _Vote2.default.delete(data.vote.id, () => {
        _Answer2.default.update(aId, { voteCount: 1 }, () => {});
      });
    }
    const vote = new _Vote2.default();
    vote.answerId = aId;
    vote.userId = userId;
    vote.vote = 1;
    return vote.save(data2 => {
      if (!data2.status) {
        return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
      }
      return _Answer2.default.update(aId, { voteCount: 1 }, () => res.status(_config.code.ok).json(data2));
    });
  });
}

function downVoteAnswer(req, res) {
  const aId = req.params.answerId;
  const userId = res.locals.user.id;

  return _Vote2.default.find(userId, aId, data => {
    if (!data.status) {
      return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
    }
    if (data.vote && data.vote.vote === -1) {
      return _Vote2.default.delete(data.vote.id, () => _Answer2.default.update(aId, { voteCount: 1 }, () => {}));
    }if (data.vote && data.vote.vote === 1) {
      _Vote2.default.delete(data.vote.id, () => {
        _Answer2.default.update(aId, { voteCount: -1 }, () => {});
      });
    }
    const vote = new _Vote2.default();
    vote.answerId = aId;
    vote.userId = userId;
    vote.vote = -1;
    return vote.save(data2 => {
      if (!data2.status) {
        return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
      }
      return _Answer2.default.update(aId, { voteCount: -1 }, () => res.status(_config.code.ok).json(data2));
    });
  });
}

function answerRoutes(router) {
  router.post('/questions/:questionId/answers', postAnswer);
  router.put('/questions/:questionId/answers/:answerId', acceptAnswer);
  router.delete('/questions/:questionId/answers/:answerId', deleteAnswer);
  router.put('/questions/:questionId/answers/:answerId/upvote', upVoteAnswer);
  router.put('/questions/:questionId/answers/:answerId/downvote', downVoteAnswer);
}

exports.default = answerRoutes;