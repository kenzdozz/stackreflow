import Question from '../Model/Question';
import { code, errMsg } from '../config';
import Answer from '../Model/Answer';

function validate(req) {
  const msg = [];
  let status = true;

  if (!req.body.title || req.body.title === '') {
    msg.push('Question title is required.');
    status = false;
  }
  if (!req.body.body || req.body.body === '') {
    msg.push('Question body is required.');
    status = false;
  }
  return {
    status,
    message: JSON.stringify(msg),
  };
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
    if (!data.status) return res.status(code.serverError).json(errMsg.serverError);
    return res.status(code.ok).json(data);
  });
}

function getQuestion(req, res) {
  return Question.find(req.params.questionId, (data) => {
    if (!data.status) return res.status(code.serverError).json(errMsg.serverError);
    if (!data.question) return res.status(code.notFound).json(errMsg.notFound.question);
    return Answer.findForQuestion(data.question.id, (data2) => {
      if (!data2.status) return res.status(code.serverError).json(errMsg.serverError);
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
    if (!data.status) return res.status(code.serverError).json(errMsg.serverError);
    if (data.questions.length < 1) return res.status(code.notFound).json(errMsg.notFound.questions);
    return res.status(code.ok).json(data);
  });
}

function deleteQuestion(req, res) {
  return Question.find(req.params.questionId, (data) => {
    if (!data.status) return res.status(code.serverError).json(errMsg.serverError);
    if (!data.question) return res.status(code.notFound).json(errMsg.notFound.question);
    if (data.question.userId !== res.locals.user.id) {
      return res.status(code.unAuthorized).json(errMsg.unAuthorized);
    }
    return Question.delete(req.params.questionId, (data2) => {
      if (!data2.status) return res.status(code.serverError).json(errMsg.serverError);
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
