import Question from '../Model/Question';
import { code, errMsg, timeAgo } from '../config';
import Answer from '../Model/Answer';
import Vote from '../Model/Vote';

function validate(req) {
  const msg = {};
  let status = true;

  if (!req.body.body || req.body.body === '') {
    msg.body = 'Answer body is required.';
    status = false;
  }
  return {
    status,
    errors: msg,
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
    const resData = data;
    Question.update(resData.answer.question_id, { answer_count: 1 }, () => {});
    resData.answer.created = timeAgo(resData.answer.created_at);
    return res.status(code.ok).json(resData);
  });
}

function acceptAnswer(req, res) {
  const qId = req.params.questionId;
  const aId = req.params.answerId;
  return Question.find(qId, (data) => {
    if (!data.status) {
      return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
    }
    if (!data.question) {
      return res.status(code.notFound).json({ status: false, errors: errMsg.notFound.question });
    }
    if (data.question.user_id !== res.locals.user.id) {
      return res.status(code.unAuthorized).json({ status: false, errors: errMsg.unAuthorized });
    }
    return Answer.find(aId, (data2) => {
      if (!data2.status) {
        return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
      }
      if (!data2.answer) {
        return res.status(code.notFound).json({ status: false, errors: errMsg.notFound.answer });
      }
      const accepted = !data2.answer.accepted;
      return Answer.rejectAnswers(qId, () => Answer.update(aId, { accepted }, (data3) => {
        if (!data3.status) {
          return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
        }
        return Question.update(qId, { answered: accepted }, () => res.status(code.ok).json({ status: true, message: 'Answer accepted' }));
      }));
    });
  });
}

function deleteAnswer(req, res) {
  return Answer.find(req.params.answerId, (data) => {
    if (!data.status) {
      return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
    }
    if (!data.answer) {
      return res.status(code.ok).json({ status: false, errors: errMsg.notFound.answer });
    }
    if (data.answer.user_id !== res.locals.user.id) {
      return res.status(code.unAuthorized).json({ status: false, errors: errMsg.unAuthorized });
    }
    return Answer.delete(req.params.answerId, (data2) => {
      if (!data2.status) {
        return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
      }
      Question.update(data.answer.question_id, { answer_count: -1 }, () => {});
      return res.status(code.ok).json(data2);
    });
  });
}

function upVoteAnswer(req, res) {
  const aId = req.params.answerId;
  const userId = res.locals.user.id;

  return Vote.find(userId, aId, (data) => {
    if (!data.status) {
      return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
    }
    if (data.vote && data.vote.vote === 1) {
      return Vote.delete(data.vote.id, () => Answer.update(aId, { voteCount: -1 }, () => {}));
    } if (data.vote && data.vote.vote === -1) {
      Vote.delete(data.vote.id, () => {
        Answer.update(aId, { voteCount: 1 }, () => {});
      });
    }
    const vote = new Vote();
    vote.answerId = aId;
    vote.userId = userId;
    vote.vote = 1;
    return vote.save((data2) => {
      if (!data2.status) {
        return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
      }
      return Answer.update(aId, { voteCount: 1 }, () => res.status(code.ok).json(data2));
    });
  });
}

function downVoteAnswer(req, res) {
  const aId = req.params.answerId;
  const userId = res.locals.user.id;

  return Vote.find(userId, aId, (data) => {
    if (!data.status) {
      return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
    }
    if (data.vote && data.vote.vote === -1) {
      return Vote.delete(data.vote.id, () => Answer.update(aId, { voteCount: 1 }, () => {}));
    } if (data.vote && data.vote.vote === 1) {
      Vote.delete(data.vote.id, () => {
        Answer.update(aId, { voteCount: -1 }, () => {});
      });
    }
    const vote = new Vote();
    vote.answerId = aId;
    vote.userId = userId;
    vote.vote = -1;
    return vote.save((data2) => {
      if (!data2.status) {
        return res.status(code.serverError).json({ status: false, errors: errMsg.serverError });
      }
      return Answer.update(aId, { voteCount: -1 }, () => res.status(code.ok).json(data2));
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

export default answerRoutes;
