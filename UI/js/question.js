/* global handleBtn BaseUrl fetchCall window document */
let manageQ = null;
window.onload = () => {
  const loader = '<div class="loader"><i class="fa fa-spinner fa-spin"></i></div>';

  const questionsDiv = document.querySelector('.questions');
  questionsDiv.innerHTML = loader;
  const url = `${BaseUrl}/api/v1/questions/${getParameterByName('id')}`;

  fetchCall(url, 'GET', null, (error, response) => {
    if (error) {
      questionsDiv.innerHTML = '<h2>An error has been encountered.</h2>';
      document.querySelector('.answer').remove();
      console.log(error);
      return handleBtn(false);
    }

    handleBtn(response.authCheck);
    if (!response.status) {
      document.querySelector('.answer').remove();
      questionsDiv.innerHTML = '<h2>Question Not Found</h2>';
      return;
    }
    const question = response.question;
    manageQ = question.manage;
    let questionDiv = `<h3 class="qtitle">${question.title}</h3>
                    <div id="q${question.id}" class="question">
                        <div class="summary">
                            <p class="mt0">${question.body}</p>
                            <div class="tags">${question.tags != 'undefined' ? question.tags : ''}</div>
                            <div class="authored">
                                <span class="time">${question.created} </span>
                                <a class="author" href="user.html?id=${question.user_id}">${question.username}</a>
                            </div>
                        </div>
                        <div class="votes">
                            <span class="mini-count">${question.view_count}</span>
                            <span> views</span>
                        </div>
                        <div class="answers ${question.answered ? 'accepted' : ''}">
                            <span class="mini-count">${question.answer_count}</span>
                            <span> answers</span>
                        </div>`;
    if (question.manage) {
      questionDiv += `<a href="javascript:;" class="delete-question fr" data-id="${question.id}"><i class="fa fa-trash"></i></a>`;
    }
    questionDiv += '</div><div class="answers">';
    response.answers.forEach((answer) => {
      questionDiv += `
                        <div id="a${answer.id}" class="answer my3">
                            <div class="voting"><div class="votes">
                                <a class="${answer.voted === 1 ? 'voted' : ''} upvote" title="Upvote" href="javascript:;" data-id="${answer.id}">
                                <i class="fa fa-arrow-circle-up"></i></a>
                            </div>
                            <span class="vcount">${answer.vote_count}</span>
                            <div class="votes">
                                <a class="${answer.voted === -1 ? 'voted' : ''} downvote" title="Down vote" href="javascript:;" data-id="${answer.id}">
                                    <i class="fa fa-arrow-circle-down"></i>
                                </a>
                            </div></div>`;
      if (question.manage) {
        questionDiv += `<a href="javascript:;" title="Accept answer" class="accept-answer ${answer.accepted ? 'accepted' : ''}" data-id="${answer.id}">
                            <i class="fa fa-check"></i></a>
                            <a href="javascript:;" class="delete-answer fr" data-id="${answer.id}"><i class="fa fa-trash"></i></a>`;
      } else if (answer.accepted) {
        questionDiv += `<span class="accept-answer accepted" data-id="${answer.id}">
                            <i class="fa fa-check"></i></span>`;
      }
      questionDiv += `<div class="summary">
                                <p class="mt0">${answer.body}</p>
                                <div class="authored">
                                    <span class="time">${answer.created} </span>
                                    <a class="author" href="user.html?id=${answer.user_id}">${answer.username}</a>
                                </div>
                            </div>
                        </div>`;
    });
    questionDiv += '</div>';
    questionsDiv.innerHTML = questionDiv;

    const hash = location.href.substring(location.href.indexOf('#') + 1);
    if (location.href.indexOf('#') > 0) {
      const elemScroll = document.querySelector(`#${hash}`);
      elemScroll.style.background = '#f58021';
      elemScroll.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      elemScroll.style.transition = 'background 3s';
      elemScroll.style.background = '#fff';
    }
  });
};

document.querySelector('#answerQuestion').onsubmit = function (event) {
  event.preventDefault();
  console;
  const form = this;
  const question = {
    body: form.querySelector('textarea[name=body]').value,
  };
  const loader = document.createElement('i');
  loader.setAttribute('class', 'fa fa-spinner fa-spin');
  const submitBtn = form.querySelector('button');
  if (submitBtn.childNodes.length === 1) submitBtn.appendChild(loader);
  form.querySelectorAll('.input-error').forEach(input => input.innerHTML = '');

  const url = `${BaseUrl}/api/v1/questions/${getParameterByName('id')}/answers`;
  fetchCall(url, 'POST', question, (err, response) => {
    if (err) return submitBtn.removeChild(loader);

    if (response.errors === 'Unauthorized Access - invalid or no token') {
      return location.href = 'login.html';
    }
    if (!response.status) {
      for (const key in response.errors) {
        document.querySelector(`.input-error.${key}`).innerHTML = response.errors[key];
      }
      return submitBtn.removeChild(loader);
    }
    form.reset();
    submitBtn.removeChild(loader);
    const answer = response.answer;
    let questionDiv = `
                        <div id="a${answer.id}" class="answer my3">
                            <div class="voting"><div class="votes">
                                <i class="fa fa-arrow-circle-up"></i>
                            </div>
                            <span>${answer.vote_count}</span>
                            <div class="votes">
                                <i class="fa fa-arrow-circle-down"></i>
                            </div></div>`;
    if (manageQ) {
      questionDiv += `<a href="javascript:;" title="Accept answer" class="accept-answer" data-id="${answer.id}">
                            <i class="fa fa-check"></i></a>`;
    }
    questionDiv += `<a href="javascript:;" class="delete-answer fr" data-id="${answer.id}"><i class="fa fa-trash"></i></a>
                            <div class="summary">
                                <p class="mt0">${answer.body}</p>
                                <div class="authored">
                                    <span class="time">${answer.created} </span>
                                    <a class="author" href="user.html?id=${answer.user_id}">${answer.username}</a>
                                </div>
                            </div>
                        </div>`;
    const questionsDiv = document.querySelector('.questions');
    questionsDiv.innerHTML += questionDiv;
  });
};

document.addEventListener('click', (event) => {
  if (!hasClass(event.target, 'fa')) return;
  const anchor = event.path[1];
  if (hasClass(anchor, 'delete-answer')) {
    deleteAnswer(anchor);
  } else if (hasClass(anchor, 'accept-answer')) {
    acceptAnswer(anchor);
  } else if (hasClass(anchor, 'delete-question')) {
    deleteQuestion(anchor);
  } else if (hasClass(anchor, 'upvote')) {
    voteAnswer(anchor, 1);
  } else if (hasClass(anchor, 'downvote')) {
    voteAnswer(anchor, -1);
  }
}, false);

function voteAnswer(anchor, action) {
  const answerId = anchor.dataset.id;
  const removeVote = hasClass(anchor, 'voted');
  const votingDiv = anchor.parentElement.parentElement;
  const dVote = votingDiv.querySelector('.downvote');
  const uVote = votingDiv.querySelector('.upvote');
  const vCount = votingDiv.querySelector('.vcount');
  let removed = false;
  let addCount = 0;
  let url = null;

  if (action === 1) {
    url = `${BaseUrl}/api/v1/questions/${getParameterByName('id')}/answers/${answerId}/upvote`;
    anchor.classList.add('voted');
    addCount = removeVote ? -1 : 1;
    if (hasClass(dVote, 'voted')) {
      dVote.classList.remove('voted');
      removed = true;
      addCount = 2;
    }
    vCount.innerHTML = parseInt(vCount.innerHTML) + addCount;
  } else {
    url = `${BaseUrl}/api/v1/questions/${getParameterByName('id')}/answers/${answerId}/downvote`;
    anchor.classList.add('voted');
    addCount = removeVote ? 1 : -1;
    if (hasClass(uVote, 'voted')) {
      uVote.classList.remove('voted');
      removed = true;
      addCount = -2;
    }
    vCount.innerHTML = parseInt(vCount.innerHTML) + addCount;
  }
  if (removeVote) anchor.classList.remove('voted');

  fetchCall(url, 'PUT', null, (err, res) => {
    if (err) {
      console.log(err);
      if (removeVote) anchor.classList.add('voted');
      else if (action === 1) {
        anchor.classList.remove('voted');
        addCount = removeVote ? 1 : -1;
        if (removed) {
          dVote.classList.add('voted');
          addCount = -2;
        }
      } else {
        anchor.classList.remove('voted');
        addCount = removeVote ? -1 : 1;
        if (removed) {
          uVote.classList.add('voted');
          addCount = 2;
        }
      }
    }
  });
}

function acceptAnswer(anchor) {
  let msg = 'Accept this answer?';
  let accept = true;
  if (hasClass(anchor, 'accepted')) {
    msg = 'Reject this answer?';
    accept = false;
  }
  if (!confirm(msg)) return;
  anchor.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  const answerId = anchor.dataset.id;
  const url = `${BaseUrl}/api/v1/questions/${getParameterByName('id')}/answers/${answerId}`;
  const answersCount = document.querySelector('.question .answers .mini-count');

  fetchCall(url, 'PUT', null, (err, res) => {
    if (err) return anchor.innerHTML = '<i class="fa fa-check"></i>';
    anchor.innerHTML = '<i class="fa fa-check"></i>';
    document.querySelectorAll('.accept-answer.accepted').forEach((element) => {
      element.setAttribute('class', 'accept-answer');
    });
    if (accept) {
      anchor.setAttribute('class', 'accept-answer accepted');
      document.querySelector('.question .answers').setAttribute('class', 'answers accepted');
    } else {
      anchor.setAttribute('class', 'accept-answer');
      document.querySelector('.question .answers').setAttribute('class', 'answers');
    }
  });
}

function deleteAnswer(anchor) {
  if (!confirm('Delete this answer?')) return;
  anchor.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  const answerId = anchor.dataset.id;
  const url = `${BaseUrl}/api/v1/questions/${getParameterByName('id')}/answers/${answerId}`;
  const answersCount = document.querySelector('.question .answers .mini-count');

  fetchCall(url, 'DELETE', null, (err, res) => {
    if (err) return anchor.innerHTML = '<i class="fa fa-trash"></i>';
    anchor.parentElement.remove();
    answersCount.innerHTML = parseInt(answersCount.innerHTML) - 1;
  });
}

function deleteQuestion(anchor) {
  if (!confirm('Delete this question?')) return;
  anchor.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
  const questionId = anchor.dataset.id;
  const url = `${BaseUrl}/api/v1/questions/${questionId}`;

  fetchCall(url, 'DELETE', null, (err, res) => {
    if (err) return anchor.innerHTML = '<i class="fa fa-trash"></i>';
    location.href = 'index.html';
  });
}
