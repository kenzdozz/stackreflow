/* global handleBtn BaseUrl fetchCall document */
document.querySelector('form').onsubmit = function (event) {
  event.preventDefault();
  const form = this;
  const user = {
    email: form.querySelector('input[name=email]').value,
    password: form.querySelector('input[name=password]').value,
  };
  const loader = document.createElement('i');
  loader.setAttribute('class', 'fa fa-spinner fa-spin');
  const loginBtn = form.querySelector('button');
  if (loginBtn.childNodes.length === 1) loginBtn.appendChild(loader);
  form.querySelectorAll('.input-error').forEach(input => input.innerHTML = '');

  const url = `${BaseUrl}/api/v1/auth/login`;
  fetchCall(url, 'POST', user, (err, response) => {
    if (err) return loginBtn.removeChild(loader);
    if (!response.status) {
      for (const key in response.errors) {
        document.querySelector(`.input-error.${key}`).innerHTML = response.errors[key];
      }
      return loginBtn.removeChild(loader);
    }
    localStorage.setItem('userToken', response.token);
    localStorage.setItem('userId', response.user.id);
    location.href = 'index.html';
  });
};
