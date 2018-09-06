
import { code, errMsg, timeAgo } from '../config';
import User from '../Model/User';
import Question from '../Model/Question';
import Answer from '../Model/Answer';

function getUser(req, res) {
  return User.find(req.params.id, (data) => {
    if (!data.status) {
      return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
    }
    if (!data.user) {
      return res.status(code.notFound).json({ status: false, errors: 'User not found' });
    }
    const resData = data;
    delete resData.user.password;
    const sort = req.query.sort === 'top' ? 'top' : 'new';
    const type = req.query.type === 'answers' ? 'answers' : 'questions';
    if (type === 'answers') {
      return Answer.findForUser(resData.user.id, sort, (data2) => {
        if (!data2.status) {
          return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
        }
        let question = null;
        data2.questions.forEach((aQuestion) => {
          question = aQuestion;
          question.created = timeAgo(question.created_at);
        });
        resData.user.questions = data2.questions;
        return res.status(code.ok).json(resData);
      });
    }
    return Question.findForUser(resData.user.id, sort, (data2) => {
      if (!data2.status) {
        return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
      }
      let question = null;
      data2.questions.forEach((aQuestion) => {
        question = aQuestion;
        question.created = timeAgo(question.created_at);
      });
      resData.user.questions = data2.questions;
      return res.status(code.ok).json(resData);
    });
  });
}

function getUsers(req, res) {
  return User.findAll((data) => {
    if (!data.status) {
      return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
    }
    let user = null;
    data.users.forEach((aUser) => {
      user = aUser;
      delete user.password;
    });
    return res.status(code.ok).json(data);
  });
}

function userRoutes(router) {
  router.get('/users/:id', getUser);
  router.get('/users', getUsers);
}

export default userRoutes;
