// http://127.0.0.1:5501/pages/dramaInfo.html?id=2
import {timeStampToTime ,localLoginChecker, sweetAlert, toggleLoading} from './helpers/util.js'; //載入通用js
import {renderUserMenu} from './helpers/renderUserMenu.js'; //載入通用js
import {updateList} from './helpers/updateUserList.js';
const id = location.href.split("=")[1];
const dramaList = document.querySelector('[data-dramaList]');//顯示戲劇的列表
const dramaTitle = document.querySelector('.dramaTitle');
const dramaInfo = document.querySelector('.dramaInfo');
const commentsList = document.querySelector('[data-comments]');
let dramaObj = [];
let loveList = [];
let wishList = [];
let dramaComments = [];
function getDramaInfo(id){
    toggleLoading();
    axios.get(`${baseUrl}/dramas/${id}`)
    .then((response)=>{
        dramaObj = response.data;
        renderDramaData(dramaObj);
    })
    .catch((error)=>{
        console.log(error);
    })
    .finally(()=>{
      toggleLoading();
    })
};
function getUserLovelist(userId, token){
  toggleLoading();
  axios.get(`${baseUrl}/600/users/${userId}/lovelists`
  ,{
    headers:{
        "authorization": `Bearer ${token}`
    }
  })
  .then((res)=>{
    loveList = res.data.map((item)=>item.dramaId);
  })
  .catch((error)=>{
    if (error?.response?.status === 401) {
      sweetAlert('登入逾時，請重新登入', 'warning');
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }
    console.log(error);
  })
  .finally(()=>{
    toggleLoading();
  })
};
function getUserWishlist(userId, token){
  toggleLoading();
  axios.get(`${baseUrl}/600/users/${userId}/wishlists`
  ,{
    headers:{
        "authorization": `Bearer ${token}`
    }
  })
  .then((res)=>{
    wishList = res.data.map((item)=>item.dramaId);
  })
  .catch((error)=>{
    if (error?.response?.status === 401) {
      // localStorage.removeItem('myCat');
      sweetAlert('登入逾時，請重新登入', 'warning');
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }
    console.log(error);
  })
  .finally(()=>{
    toggleLoading();
  })
};
function renderDramaData(dramaObj){
    const {id, name, img, year, type, intro, dramaSynopsis, rank, characters, wiki, ostLink} = dramaObj;
    let typeStr = '';
    let favorite = loveList.includes(id)? 'symbols-fill':'';
    let wish = wishList.includes(id)? 'done':'add';
    let charactersStr = '';
    type.forEach((typeItem)=>{
        typeStr+=`<a href="#" class="btn btn-outline-primary mb-1 tag">${typeItem}</a>`;
    })
    characters.forEach((characterItem)=>{
        const {actor, character, characterIntro} = characterItem;
        charactersStr+=`<tr>
        <td>${actor}</td>
        <td>${character}</td>
        <td>${characterIntro}
        </td>
      </tr>`;
    })
    const titleStr = `
    <div class="cardImg mb-1">
    <img src="${img}" class="dramaImg" alt="">
    </div>
    <div class="mb-6">
        <div class="d-flex">
        <h2 class="card-title me-3">${name}</h2>
        <div class="d-flex align-items-center">
            <span class="material-symbols-outlined symbols-fill text-primary starIcon">
            star
            </span>
            <span>${rank}</span>
        </div>
        </div>
        ${typeStr}
        <div class="d-flex justify-content-start align-items-center">
        <div>
            <a href="#" class="btn btn-outline-secondary rounded-pill me-1 bg-lightSecondary text-secondary border-0">
            <span>
                評分
            </span>
            </a>
            <button class="btn btn-outline-secondary rounded-circle me-1 iconLightSecondary material-symbols-outlined ${favorite}" data-id="${id}" data-love="${favorite}">
              favorite
            </button>
            <button class="btn btn-outline-secondary rounded-circle iconLightSecondary add material-symbols-outlined" data-id="${id}" data-wish="${wish}">
              ${wish}
            </button>
        </div>
        </div>
    </div>
    `;
    const infoStr = `
    <p>年份：${year}</p>
    <h6 class="text-secondary mb-1">基本介紹</h6>
    <p class="ms-2 mb-3">${intro}</p>
    <h6 class="text-secondary mb-1">劇情介紹</h6>
    <p class="ms-2 mb-3">${dramaSynopsis}</p>
    <h6 class="text-secondary mb-1">角色介紹</h6>
    <div class="table-responsive ms-2 me-1 mb-3">
      <table class="table">
        <thead>
          <tr class="table-primary">
            <th scope="col" width="8%">演員</th>
            <th scope="col" width="8%">角色</th>
            <th scope="col" width="84%">介紹</th>
          </tr>
        </thead>
        <tbody>
          ${charactersStr}
        </tbody>
      </table>
    </div>
    <h6 class="text-secondary mb-1">Original Sound Track (OST)</h6>
    <div class="row mb-4">
      <div class="col-lg-6 col-12">
        <div class="video-container ms-2">
          <iframe width="560" height="315" src="${ostLink+"?rel=0"}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      </div>
    </div>
    <div class="text-center"><a href="${wiki}" target="_blank" class="btn btn-outline-darkSecondary rounded-pill">更多資訊</a></div>
    `;
    dramaTitle.innerHTML = titleStr;
    dramaInfo.innerHTML = infoStr;
    document.querySelector('[data-title]').textContent = name;
}
function getComments(id){
  toggleLoading();
  axios.get(`${baseUrl}/dramas/${id}/comments?_expand=user&_sort=timeStamp&_order=asc`)
  .then((response)=>{
    dramaComments = response.data;
    renderComments(dramaComments);
  })
  .catch((error)=>{
    console.log(error);
  })
  .finally(()=>{
    toggleLoading();
  })
}
function renderComments(data){
  if(data.length==0){
    commentsList.innerHTML = `<h5 class="text-center">目前尚無留言</h5>`;
    return
  }
  let str = '';
  data.forEach((item)=>{
    const {body, timeStamp, user} = item;
    str+=`<li class="row card rounded-5 shadow-sm flex-row p-2 mb-2">
    <div class="col-lg-1 col-md-2 col-3"> 
      <img src="${user.avatar}" alt="" class="rounded-circle mb-1">
    </div>
    <div class="col-lg-11 col-md-10 col-9">
    <div class="mb-1">
      <span class="text-secondary">${user.nickName}</span>
      <span class="text-muted fs-7"> | </span>
      <span class="text-muted fs-7">${timeStampToTime(timeStamp)}</span>
    </div>
      <p class="text-break">${body}</p>
    </div>
  </li>`;
  })
  commentsList.innerHTML = str;
}
function init(){
  if(localLoginChecker()){
    renderUserMenu();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    getUserLovelist(userId, token);
    getUserWishlist(userId, token);
  }

  if(id==undefined){
    //防呆，移轉頁面
    sweetAlert("您的操作錯誤，將移轉到探索韓劇",'error');
    setTimeout(() => {
      location.href = "./exploreDrama.html";
    }, 1500);
    //location.href = "./exploreDrama.html";
  }

  setTimeout(() => {
    getDramaInfo(id);
    getComments(id);
  }, 0);
    
}
init();

dramaList.addEventListener('click',(e)=>{
    updateList(e);
})
