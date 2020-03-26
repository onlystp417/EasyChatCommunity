// api url
const signUpUrl = 'http://34.80.201.121/api/signup';
const loginUrl = 'http://34.80.201.121/api/login';
const addPost = 'http://34.80.201.121/api/storePost';
// const loadPost = 'http://34.80.201.121/api/api/board';
const baseUrl = 'http://5e7b2f690e04630016332eb8.mockapi.io/api';


// 取得 input 節點
const account = document.querySelector('#inputAccount');

const password = document.querySelector('#inputPassword');

// 取得按鈕節點
const signUpBtn = document.querySelector('#signUpBtn');
const loginBtn = document.querySelector('#loginBtn');

// 註冊介面
signUpBtn.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(account.value);
  console.log(password.value);
  fetch(signUpUrl, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: account.value,
      password: password.value
    })
  })
    .then(
      (res) => {
        if (res.status == 200) {
          alert('註冊成功！');
        } else {
          throw error;
        }
        console.log(res);
      }
    ).catch(err => {
      console.log(err);
      alert('註冊失敗，該帳號已被使用。')
    })
})

// 登入介面
loginBtn.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(account.value);
  console.log(password.value);
  fetch(loginUrl, {
    body: JSON.stringify({
      name: account.value,
      password: password.value
    }),
    cache: 'no-cache',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    mode: 'cors'
  })
    .then(
      function (res) {
        if (res.status == 200) {
          window.location.assign(`http://127.0.0.1:5500/chatBoard.html`);
        } else {
          throw error;
        }
        console.log(res.status)
        return res.json()
      }
    )
    .then(
      function (data) {
        // document.cookie = `name = ${data.name}; user_id = ${data.id}; api_token = ${data.api_token}; created_at = ${data.created_at}`;
        document.cookie = `name = ${data.name};`;
        document.cookie = `user_id = ${data.id};`;
        document.cookie = `api_token = ${data.api_token}`;
        document.cookie = `created_at = ${data.created_at}`;
        console.log(data);
        console.log(typeof (account.value));
        console.log(password.value);

      })
    .catch(err => {
      console.log(err);
      alert('登入失敗！');
      window.location.reload();
    })
})