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

  if (!req.body.title || req.body.title === '') {
    msg.title = 'Question title is required. ';
    status = false;
  }
  if (!req.body.body || req.body.body === '') {
    msg.body = 'Question body is required.';
    status = false;
  }
  return { status, errors: msg };
}

function postQuestion(req, res) {
  const valid = validate(req);

  if (!valid.status) return res.status(_config.code.badRequest).json(valid);

  const question = new _Question2.default();
  question.title = req.body.title.trim();
  question.body = req.body.body.trim();
  if (req.body.tags) question.tags = req.body.tags.trim();
  question.userId = res.locals.user.id;

  return question.save(data => {
    if (!data.status) {
      return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
    }
    return res.status(_config.code.ok).json(data);
  });
}

function getQuestion(req, res) {
  const userId = res.locals.user.id;
  return _Question2.default.find(req.params.questionId, data => {
    if (!data.status) {
      return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
    }
    if (!data.question) return res.status(_config.code.ok).json({ status: false, question: {} });
    return _Answer2.default.findForQuestion(data.question.id, data2 => {
      if (!data2.status) {
        return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
      }
      const aQuestion = data.question;
      aQuestion.created = (0, _config.timeAgo)(aQuestion.created_at);
      aQuestion.view_count += 1;
      aQuestion.manage = aQuestion.user_id === userId;
      const theAnswers = [];

      function handleAnswer(anAnswer, callback) {
        if (!anAnswer) return callback();
        const answer = anAnswer;
        answer.created = (0, _config.timeAgo)(answer.created_at);
        answer.manage = answer.user_id === userId;
        if (!userId) {
          theAnswers.push(answer);
          return callback();
        }
        return _Vote2.default.find(userId, answer.id, data3 => {
          answer.voted = data3.vote ? data3.vote.vote : '';
          theAnswers.push(answer);
          callback();
        });
      }

      let i = 0;
      const loopAnswers = answers => {
        handleAnswer(answers[i], () => {
          i += 1;
          if (i < answers.length) {
            return loopAnswers(answers);
          }
          const responseData = {
            status: true,
            question: aQuestion,
            answers: theAnswers,
            authCheck: res.locals.authCheck
          };
          _Question2.default.update(aQuestion.id, { view_count: 1 }, () => {});
          return res.status(_config.code.ok).json(responseData);
        });
      };

      return loopAnswers(data2.answers);
    });
  });
}

function getQuestions(req, res) {
  return _Question2.default.findAll(data => {
    if (!data.status) {
      return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
    }
    const resData = data;
    resData.authCheck = res.locals.authCheck;
    let question = null;
    resData.questions.forEach(aQuestion => {
      question = aQuestion;
      question.created = (0, _config.timeAgo)(question.created_at);
      question.manage = question.user_id === res.locals.user.id;
    });
    return res.status(_config.code.ok).json(resData);
  });
}

function deleteQuestion(req, res) {
  return _Question2.default.find(req.params.questionId, data => {
    if (!data.status) {
      return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
    }
    if (!data.question) {
      return res.status(_config.code.ok).json({ status: false, errors: _config.errMsg.notFound.question });
    }
    if (data.question.user_id !== res.locals.user.id) {
      return res.status(_config.code.unAuthorized).json({ status: false, errors: _config.errMsg.unAuthorized });
    }
    return _Question2.default.delete(req.params.questionId, data2 => {
      if (!data2.status) {
        return res.status(_config.code.serverError).json({ status: false, errors: _config.errMsg.serverError });
      }
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