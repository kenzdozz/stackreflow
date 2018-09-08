/* global handleBtn BaseUrl location fetchCall document */
handleBtn();
document.querySelector('#askQuestion').onsubmit = function (event) {
  event.preventDefault();
  const form = this;
  const question = {
    title: form.querySelector('input[name=title]').value,
    body: form.querySelector('textarea[name=body]').value,
    tags: form.querySelector('input[name=tags]').value,
  };
  const loader = document.createElement('i');
  loader.setAttribute('class', 'fa fa-spinner fa-spin');
  const submitBtn = form.querySelector('button');
  if (submitBtn.childNodes.length === 1) submitBtn.appendChild(loader);
  form.querySelectorAll('.input-error').forEach(input => input.innerHTML = '');

  const url = `${BaseUrl}/api/v1/questions`;
  return fetchCall(url, 'POST', question, (error, response) => {
    console.log(response);
    if (error) return submitBtn.removeChild(loader);
    if (!response.status) {
      if (response.errors === 'Unauthorized Access - invalid or no token') {
        location.href = 'login.html';
        return;
      }
      for (const key in response.errors) {
        document.querySelector(`.input-error.${key}`).innerHTML = response.errors[key];
      }
      return submitBtn.removeChild(loader);
    }
    location.href = `question.html?id=${response.question.id}`;
    return submitBtn.removeChild(loader);
  });
};
