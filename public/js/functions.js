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
    const userId = localStorage.getItem('userId');
    if (!authCheck && userId){
        authCheck = true;
    }
    const loginBtn = document.querySelector('.nav .login');
    const signupBtn = document.querySelector('.nav .signup');
    if (authCheck) {
        loginBtn.setAttribute('href', `user.html?id=${userId}`);
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

function getParameterByName(name) {
    url = window.location.href;
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

document.querySelector('.nav-toggle').onclick = () => {
    let sideBar = document.querySelector('.sidebar-right');
    if (hasClass(sideBar, 'show'))
        sideBar.classList.remove('show');
    else
        sideBar.classList.add('show');
}

document.querySelector('.search-toggle').onclick = function () {
    let searchForm = document.querySelector('.search-form');
    let logoDiv = document.querySelector('.logo-div');
    let navBar = document.querySelector('.nav');
    if (hasClass(searchForm, 'show')){
        this.querySelector('i').classList.remove('fa-times');
        this.querySelector('i').classList.add('fa-search');
        searchForm.classList.remove('show');
        logoDiv.classList.remove('hide');
        navBar.classList.remove('hide');
    }else{
        this.querySelector('i').classList.remove('fa-search');
        this.querySelector('i').classList.add('fa-times');
        searchForm.classList.add('show');
        logoDiv.classList.add('hide');
        navBar.classList.add('hide');
    }
}