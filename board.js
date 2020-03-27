// api url
const baseUrl = `${window.location.protocol}//200850ff.ngrok.io/api`;

// 取得 cookie 值（name / user_id / api_token / created_at）
function getCookieValues(prop) {
  let result =
    document.cookie
      .split(';')
      .find(item => item.trim().startsWith(`${prop
        }`))
  if (!result) return '';
  const [key, value] = result.split('=');
  return value;
}

//進主畫面 load 進所有的 post(包括 post interface)
fetch(`${baseUrl}/board`, { method: 'GET' })
  .then(res => {
    return res.json();
  }).then(boardData => {
    console.log(boardData);
    // boardData = result;
    domGenerator(boardData);
  });

// 取得 user name
const userName = getCookieValues('name');

let totalCommunitBoard = '';

// 取得主要渲染區塊
const communitArea = document.querySelector('.communitArea');

function domGenerator(boardData) {
  let length = boardData.length;

  // Use to get all template string values.
  for (let i = 0; i < length; i++) {
    let communitBoard = `
      <article class="communit-board" >
        <header class="p-3">
          <p class="user m-0">${ boardData[i].user.name}</p>
          <time>${ boardData[i].created_at}</time>
        </header>
        <div class="px-3">
          <section class="main">
            <p class="py-3">${ boardData[i].content}</p>
          </section>
          <hr class="my-2">
          <div class="row no-gutters">
            <div class="col-6">
              <img class="d-inline-block align-middle" width="20px" height="20px" src="./image/liked.png" alt="">
              <span class="stamp-counter d-inline-block align-middle">${ boardData[i].likes_count}</span>
            </div>
            <div class="col-6 text-right">
              <span class="comment-counter">${ boardData[i].comments_count}則留言</span>
            </div>
          </div>
          <hr>
          <div class="interaction row no-gutters">
            <button class="stamp stamp-like col-6 border-0">
              <div>
                <img width="20px" height="20px" src="./image/like_none.png" alt="">
                <span>讚</span>
              </div>
            </button>
            <button class="stamp stamp-unlike col-6 border-0 disapear">
              <div>
                <img width="20px" height="20px" src="./image/liked.png" alt="">
                <span>收回讚</span>
              </div>
            </button>
            <button class="add-comment col-6 border-0">
              <img width="20px" height="20px" src="./image/comment.png" alt="">
              <span>留言</span>
            </button>
          </div>
          <hr class="my-2">
          <textarea class="text-comment bg-black-50 px-4 py-2" name="" data-postId=${boardData[i].id} cols="30" rows="1"
            placeholder="留言..."></textarea>
          ${ commentGenerator(boardData[i].comments)}
        </div>
      </article>`;
    totalCommunitBoard += communitBoard;
  }

  totalCommunitBoard = postInterface(userName) + totalCommunitBoard;
  const communitArea = document.querySelector('.communitArea');
  communitArea.innerHTML = totalCommunitBoard;

  // 選取到發文 button 節點並掛上監聽
  const addPostBtn = document.querySelector('#addPostBtn');
  addPostBtn.addEventListener('click', postAction);

  // 選取到讚 button 節點並掛上監聽
  const likeBtn = document.querySelector('.stamp-like');
  const unlikeBtn = document.querySelector('.stamp-unlike');

  likeBtn.addEventListener('click', stampLike);
  unlikeBtn.addEventListener('click', stampUnlike);

  // 選取到登出 a 連結並掛上監聽
  const logOutBtn = document.querySelector('.log-out')
  logOutBtn.addEventListener('click', logOut);
}

function commentGenerator(comments) {
  if (!comments.length) {
    return '';
  }
  else {
    let commentStr = '';
    for (let i = 0; i < comments.length; i++) {
      let str = `<section class="comments p-3">
          <div class="comments-item py-2">
            <h5 class="m-0">${comments[i].user.name}</h5>
            <p class="m-0">${comments[i].content}</p>
            <button class="p-0">回覆</button>
            <time>${comments[i].created_at}</time>
          </div>
          <!-- <div class="comments-recursive-item pl-5 py-2">
            <h5 class="m-0">name</h5>
            <p class="m-0">comment</p>
            <button class="p-0 border-0">回覆</button>
            <time>1分鐘</time>
          </div> -->
        </section>`;
      commentStr += str
    }
    return commentStr;
  }
}

// 渲染出 add post interface
function postInterface(userName) {
  return `
    <article class="communit-board add-post">
      <header class="p-3">
        <p class="user m-0">${ userName}</p>
      </header>
      <div class="px-3">
        <section class="main">
          <textarea id="postContent" class="py-3" name="" id="" cols="30" rows="1" placeholder="分享些什麼..."></textarea>
          <p class="disapear"></p>
        </section>
      </div>
      <button type="button" id="addPostBtn" class="d-block w-100 border-0 text-center py-1">發表</button>
    </article>
  `;
}

// 發文 add post
const userID = getCookieValues('user_id');
const apiToken = getCookieValues('api_token');
const loginTime = getCookieValues('created_at');

function postAction(e) {
  // 選取到 input 節點
  const postContent = document.querySelector('#postContent');

  fetch(`${baseUrl}/storePost`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uer_id: `${userID}`,
      content: postContent.value,
    })
  })
    .then(
      (res) => {
        console.log(res);
        window.location.reload();
      }
    ).catch(err => {
      console.log(err);
    })
}

// 留言
window.addEventListener('keypress', addComment);

function addComment(e) {

  // 選取到 input 節點
  let keyCode = e.keyCode;
  if (keyCode != 13) return;
  let postId = e.target.getAttribute('data-postId');
  console.log(`.text-comment[data-postId=${postId}]`)
  let textComment = document.querySelector(`.text-comment[data-postId='${postId}']`);

  fetch(`${baseUrl}/storeComment`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uer_id: `${userID}`,
      post_id: `${postId}`,
      content: textComment.value,
    })
  })
    .then(
      (res) => {
        console.log(res);
        window.location.reload();
      }
    ).catch(err => {
      console.log(err);
    })
}

// 按讚

function stampLike(e) {
  const unlikeBtn = document.querySelector('.stamp-unlike');
  const likeBtn = document.querySelector('.stamp-like');
  // unlikeBtn.style.display = "block";
  likeBtn.classList.add("disapear");
  unlikeBtn.classList.remove("disapear");
}

function stampUnlike(e) {
  const unlikeBtn = document.querySelector('.stamp-unlike');
  const likeBtn = document.querySelector('.stamp-like');
  unlikeBtn.classList.add("disapear");
  likeBtn.classList.remove("disapear");
}

// 登出
function logOut() {
  window.location.pathname = "/index.html"
  document.cookie = "name=;";
  document.cookie = "user_id=;";
  document.cookie = "api_token=";
  document.cookie = "created_at=";
}