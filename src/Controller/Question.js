import Question from '../Model/Question';
import { code, errMsg, timeAgo } from '../config';
import Answer from '../Model/Answer';
import Vote from '../Model/Vote';

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
  const userId = res.locals.user.id;
  return Question.find(req.params.questionId, (data) => {
    if (!data.status) {
      return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
    }
    if (!data.question) return res.status(code.ok).json({ status: false, question: {} });
    return Answer.findForQuestion(data.question.id, (data2) => {
      if (!data2.status) {
        return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
      }
      const aQuestion = data.question;
      aQuestion.created = timeAgo(aQuestion.created_at);
      aQuestion.view_count += 1;
      aQuestion.manage = aQuestion.user_id === userId;
      const theAnswers = [];

      function handleAnswer(anAnswer, callback) {
        if (!anAnswer) return callback();
        const answer = anAnswer;
        answer.created = timeAgo(answer.created_at);
        answer.manage = answer.user_id === userId;
        if (!userId) {
          theAnswers.push(answer);
          return callback();
        }
        return Vote.find(userId, answer.id, (data3) => {
          answer.voted = data3.vote ? data3.vote.vote : '';
          theAnswers.push(answer);
          callback();
        });
      }

      let i = 0;
      const loopAnswers = (answers) => {
        handleAnswer(answers[i], () => {
          i += 1;
          if (i < answers.length) {
            return loopAnswers(answers);
          }
          const responseData = {
            status: true,
            question: aQuestion,
            answers: theAnswers,
            authCheck: res.locals.authCheck,
          };
          Question.update(aQuestion.id, { view_count: 1 }, () => { });
          return res.status(code.ok).json(responseData);
        });
      };

      return loopAnswers(data2.answers);
    });
  });
}

function getQuestions(req, res) {
  const searchStr = req.query.search;
  if (searchStr){
    return Question.search(searchStr, (data) => {
      if (!data.status) {
        return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
      }
      const resData = data;
      resData.authCheck = res.locals.authCheck;
      let question = null;
      resData.questions.forEach((aQuestion) => {
        question = aQuestion;
        question.created = timeAgo(question.created_at);
        question.manage = question.user_id === res.locals.user.id;
      });
      return res.status(code.ok).json(resData);
    });
  }
  return Question.findAll((data) => {
    if (!data.status) {
      return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
    }
    const resData = data;
    resData.authCheck = res.locals.authCheck;
    let question = null;
    resData.questions.forEach((aQuestion) => {
      question = aQuestion;
      question.created = timeAgo(question.created_at);
      question.manage = question.user_id === res.locals.user.id;
    });
    return res.status(code.ok).json(resData);
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
