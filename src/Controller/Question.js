import Question from '../Model/Question';
import { code, errMsg } from '../config';

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

  return question.save(data => {
    if (!data.status) return res.status(code.serverError).json(errMsg.serverError);
    res.status(code.ok).json(data)
  });
}

function getQuestion(req, res) {
  return Question.find(req.params.id, (data) => {
    if (!data.status) return res.status(code.serverError).json(errMsg.serverError);
    if (!data.question) return res.status(code.notFound).json(errMsg.notFound.question);
    return res.json(data);
  });
}

function getQuestions(req, res) {
  return Question.findAll((data) => {
    if (!data.status) return res.status(code.serverError).json(errMsg.serverError);
    if (data.questions.length < 1) return res.status(code.notFound).json(errMsg.notFound.questions);
    return res.json(data);
  });
}

function questionRoutes(router) {
  router.post('/questions', postQuestion);
  router.get('/questions/:id', getQuestion);
  router.get('/questions', getQuestions);
}

export default questionRoutes;
