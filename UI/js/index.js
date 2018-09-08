/* global handleBtn BaseUrl window fetchCall document */
window.onload = () => {
  const loader = '<div class="loader"><i class="fa fa-spinner fa-spin"></i></div>';

  const questionsDiv = document.querySelector('.questions');
  questionsDiv.innerHTML = loader;

  const url = `${BaseUrl}/api/v1/questions`;
  fetchCall(url, 'GET', null, (err, response) => {
    if (err) return handleBtn(false); handleBtn(response.authCheck);
    if (!response.status) {
      return;
    }
    let questions = '';
    if (!response.questions.length) {
      return questionsDiv.innerHTML = '<h2>Be the first to ask a question.</h2>';
    }
    response.questions.forEach((question) => {
      questions += `
                <div id="q${question.id}" class="question">
                <div class="votes">
                    <span class="mini-count">${question.view_count}</span>
                    <span> views</span>
                </div>
                <div class="answers">
                    <span class="mini-count">${question.answer_count}</span>
                    <span> answers</span>
                </div>`;
      questions += `<div class="summary">
                    <h4><a href="question.html?id=${question.id}">${question.title}</a></h4>
                    <div class="tags">${question.tags != 'undefined' ? question.tags : ''}</div>
                    <div class="authored">
                        <span class="time">${question.created} </span> 
                        <a class="author" href="user.html?id=${question.user_id}">${question.username}</a>
                    </div>
                </div>
            </div>`;
    });
    questionsDiv.innerHTML = questions;
  });
};
