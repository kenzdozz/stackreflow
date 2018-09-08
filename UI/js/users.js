/* global handleBtn BaseUrl fetchCall window document */
window.onload = () => {
  const loader = '<div class="loader"><i class="fa fa-spinner fa-spin"></i></div>';

  const usersDiv = document.querySelector('.users');
  usersDiv.innerHTML = loader;
  const url = `${BaseUrl}/api/v1/users`;

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
    const users = response.users;

    let userDiv = '';
    users.forEach((user) => {
      userDiv += `<div id="u${user.id}" class="user">
                        <a href="user.html?id=${user.id}">${user.name}</a>
                        <p>Contributions</p>
                        <div>
                            <span>Q:</span>
                            <h3>${user.question_count}</h3>
                        </div>
                        <div>
                            <span>A:</span>
                            <h3>${user.answer_count}</h3>
                        </div>
                    </div>`;
    });
    usersDiv.innerHTML = userDiv;
  });
};
