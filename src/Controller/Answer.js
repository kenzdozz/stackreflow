import Question from '../Model/Question';
import { code, errMsg } from '../config';
import Answer from '../Model/Answer';

function validate(req) {
  const msg = [];
  let status = true;

  if (!req.body.body || req.body.body === '') {
    msg.push('Question body is required.');
    status = false;
  }
  return {
    status,
    message: JSON.stringify(msg),
  };
}

function postAnswer(req, res) {
  const valid = validate(req);

  if (!valid.status) return res.status(code.badRequest).json(valid);

  const answer = new Answer();
  answer.questionId = req.params.questionId;
  answer.body = req.body.body.trim();
  answer.userId = res.locals.user.id;

  return answer.save((data) => {
    if (!data.status) {
      return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
    }
    return res.status(code.ok).json(data);
  });
}

function acceptAnswer(req, res) {
  return Question.find(req.params.questionId, (data) => {
    if (!data.status) {
      return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
    }
    if (!data.question) {
      return res.status(code.notFound).json({ status: false, errors: errMsg.notFound.question });
    }
    if (data.question.user_id !== res.locals.user.id) {
      return res.status(code.unAuthorized).json({ status: false, errors: errMsg.unAuthorized });
    }
    return Answer.find(req.params.answerId, (data2) => {
      if (!data2.status) {
        return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
      }
      if (!data2.answer) {
        return res.status(code.notFound).json({ status: false, errors: errMsg.notFound.answer });
      }
      return Answer.update(req.params.answerId, { accepted: true }, (data3) => {
        if (!data3.status) {
          return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
        }
        return res.status(code.ok).json({ status: true, message: 'Answer accepted' });
      });
    });
  });
}

function answerRoutes(router) {
  router.post('/questions/:questionId/answers', postAnswer);
  router.put('/questions/:questionId/answers/:answerId', acceptAnswer);
}

export default answerRoutes;
