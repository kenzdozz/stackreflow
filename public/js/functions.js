function isLocal(){
    return (location.hostname === "localhost" || location.hostname === "127.0.0.1")
}
const BaseUrl = isLocal() ? 'http://localhost:5000' : 'https://stackreflow.herokuapp.com';

function fetchCall(url, method, data, callback) {
    let config = {
        method,
        mode: 'cors',
        dataType: "json",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            'x-access-token': localStorage.getItem('userToken'),
        },
    };
    if (data) config.body = JSON.stringify(data);
    fetch(url, config).then((resData) => {
        return resData.json();
    }).then(response => {
        callback(null, response);
    }).catch(err => {
        callback(err, null);
    });
}

function handleBtn(authCheck) {
    const loginBtn = document.querySelector('.nav .login');
    const signupBtn = document.querySelector('.nav .signup');
    if (authCheck) {
        loginBtn.setAttribute('href', 'user.html');
        loginBtn.innerHTML = 'My Account';
        loginBtn.classList.remove('hide');
        signupBtn.setAttribute('href', 'logout.html');
        signupBtn.innerHTML = 'Logout';
        signupBtn.classList.remove('hide');
    } else {
        loginBtn.classList.remove('hide');
        signupBtn.classList.remove('hide');
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function hasClass(elem, className) {
    return elem.className.split(' ').indexOf(className) > -1;
}