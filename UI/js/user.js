/* global handleBtn BaseUrl fetchCall window document */
const manageQ = null;
window.onload = () => {
  const loader = '<div class="loader"><i class="fa fa-spinner fa-spin"></i></div>';

  const usersDiv = document.querySelector('.user');
  usersDiv.innerHTML = loader;
  const url = `${BaseUrl}/api/v1/users/${getParameterByName('id')}`;

  fetchCall(url, 'GET', null, (error, response) => {
    if (error) {
      usersDiv.innerHTML = '<h2>An error has been encountered.</h2>';
      console.log(error);
      return handleBtn(false);
    }

    handleBtn(response.authCheck);
    if (!response.status) {
      usersDiv.innerHTML = '<h2>User Not Found</h2>';
      return;
    }
    const user = response.user;

    let userDiv = `<h1 class="mt0">${user.name}</h1>
                    <div class="user-contrib">
                        <div>
                            <p>Total questions asked</p>
                            <h2>${user.question_count}</h2>
                        </div>
                        <div>
                            <p>Total answers given</p>
                            <h2>${user.answer_count}</h2>
                        </div>
                    </div>
                    <div class="tabs">
                        <a class="question-tab active" href="#">Questions</a>
                        <a class="answer-tab" href="#">Answers</a>
                    </div>
                    <p class="title">Questions</p>
                    <div class="sort">
                        <span>Most: </span>
                        <a class="sort-recent active" href="#">Recent</a>
                        <a class="sort-top" href="#">Response</a>
                    </div>
                    <div class="questions">`;
    userDiv += handleQuestions(user.questions);
    usersDiv.innerHTML = userDiv;
  });
};

document.addEventListener('click', (event) => {
  const anchor = event.path[0];
  if (hasClass(anchor, 'sort-top')) {
    event.preventDefault();
    if (hasClass(anchor, 'active')) return;
    getQuestions(false, true);
  } else if (hasClass(anchor, 'sort-recent')) {
    event.preventDefault();
    if (hasClass(anchor, 'active')) return;
    getQuestions(false, false);
  } else if (hasClass(anchor, 'question-tab')) {
    event.preventDefault();
    if (hasClass(anchor, 'active')) return;
    getQuestions(false, false);
  } else if (hasClass(anchor, 'answer-tab')) {
    event.preventDefault();
    if (hasClass(anchor, 'active')) return;
    getQuestions(true, false);
  }
}, false);

function getQuestions(answers, top) {
  const loader = '<div class="loader"><i class="fa fa-spinner fa-spin"></i></div>';
  const questionsDiv = document.querySelector('.questions');
  questionsDiv.innerHTML = loader;
  let params = answers ? 'type=answers' : '';
  params += top ? `${params !== '' ? '&' : ''}sort=top` : '';
  const url = `${BaseUrl}/api/v1/users/${getParameterByName('id')}?${params}`;

  fetchCall(url, 'GET', null, (error, response) => {
    if (error) {
      return questionsDiv.innerHTML = '<h2>An error has been encountered.</h2>';
    }

    if (!response.status) {
      document.querySelector('.answer').remove();
      questionsDiv.innerHTML = '<h2>Questions Not Found</h2>';
      return;
    }
    const questions = response.user.questions;
    questionsDiv.innerHTML = handleQuestions(questions);
    if (answers) {
      document.querySelector('.tabs .question-tab').setAttribute('class', 'question-tab');
      document.querySelector('.tabs .answer-tab').setAttribute('class', 'answer-tab active');
      document.querySelector('.sort').setAttribute('style', 'display:none;');
      document.querySelector('.user .title').innerHTML = 'Answers';
    } else {
      document.querySelector('.tabs .question-tab').setAttribute('class', 'question-tab active');
      document.querySelector('.tabs .answer-tab').setAttribute('class', 'answer-tab');
      document.querySelector('.sort').setAttribute('style', 'display:block;');
      document.querySelector('.user .title').innerHTML = 'Questions';
    }
    if (top) {
      document.querySelector('.sort .sort-recent').setAttribute('class', 'sort-recent');
      document.querySelector('.sort .sort-top').setAttribute('class', 'sort-top active');
    } else {
      document.querySelector('.sort .sort-recent').setAttribute('class', 'sort-recent active');
      document.querySelector('.sort .sort-top').setAttribute('class', 'sort-top');
    }
  });
}

function handleQuestions(questions) {
  let questionsDiv = '';
  questions.forEach((question) => {
    questionsDiv += `
                        <div id="q${question.id}" class="question">
                        <div class="votes">
                            <span class="mini-count">${question.view_count}</span>
                            <span> views</span>
                        </div>
                        <div class="answers">
                            <span class="mini-count">${question.answer_count}</span>
                            <span> answers</span>
                        </div>`;
    questionsDiv += `<div class="summary">
                            <h4><a href="question.html?id=${question.id}${question.answer_id ? `#a${question.answer_id}` : ''}">
                                ${question.title}</a></h4>
                            <div class="authored">
                                <span class="time">${question.created} </span>
                            </div>
                        </div>
                    </div>`;
  });
  return questionsDiv;
}
