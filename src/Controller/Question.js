import Question from '../Model/Question';
import { code } from '../config';

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

  if (!valid.status) {
    return res.status(code.badRequest).json(valid);
  }

  const question = new Question();
  question.title = req.body.title.trim();
  question.body = req.body.body.trim();
  if (req.body.tags) question.tags = req.body.tags.trim();
  question.userId = res.locals.user.id;

  return question.save(data => res.status(code.ok).json(data));
}

// function getQuestions(req, res) {

// }

function questionRoutes(router) {
  router.post('/questions', postQuestion);
}

export default questionRoutes;
