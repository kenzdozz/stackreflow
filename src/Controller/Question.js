import Question from '../Model/Question';
import { code, errMsg } from '../config';
import Answer from '../Model/Answer';

function validate(req) {
  let msg = {};
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

  if (!valid.status) return res.status(code.badRequest).json(valid);

  const question = new Question();
  question.title = req.body.title.trim();
  question.body = req.body.body.trim();
  if (req.body.tags) question.tags = req.body.tags.trim();
  question.userId = res.locals.user.id;

  return question.save((data) => {
    if (!data.status) {
      return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
    }
    return res.status(code.ok).json(data);
  });
}

function getQuestion(req, res) {
  return Question.find(req.params.questionId, (data) => {
    if (!data.status) {
      return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
    }
    if (!data.question) return res.status(code.ok).json({ status: true, question: {} });
    return Answer.findForQuestion(data.question.id, (data2) => {
      if (!data2.status) return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
      const responseData = {
        status: true,
        question: data.question,
        answers: data2.answers,
      };
      return res.status(code.ok).json(responseData);
    });
  });
}

function getQuestions(req, res) {
  return Question.findAll((data) => {
    if (!data.status) return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
    data.authCheck = res.locals.authCheck;
    return res.status(code.ok).json(data);
  });
}

function deleteQuestion(req, res) {
  return Question.find(req.params.questionId, (data) => {
    if (!data.status) {
      return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
    }
    if (!data.question) {
      return res.status(code.ok).json({ status: false, errors: errMsg.notFound.question });
    }
    if (data.question.user_id !== res.locals.user.id) {
      return res.status(code.unAuthorized).json({ status: false, errors: errMsg.unAuthorized });
    }
    return Question.delete(req.params.questionId, (data2) => {
      if (!data2.status) {
        return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
      }
      return res.status(code.ok).json(data2);
    });
  });
}

function questionRoutes(router) {
  router.post('/questions', postQuestion);
  router.get('/questions', getQuestions);
  router.get('/questions/:questionId', getQuestion);
  router.delete('/questions/:questionId', deleteQuestion);
}

export default questionRoutes;
