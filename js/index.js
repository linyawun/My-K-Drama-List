import {timeStampToTime, localLoginChecker, sweetAlert, toggleLoading} from './helpers/util.js'; //載入通用js
import {renderUserMenu} from './helpers/renderUserMenu.js'; //載入通用js
import {updateList} from './helpers/updateUserList.js';
const searchBtn = document.querySelector('[data-searchBtn]');
const searchInput = document.querySelector('[data-searchInput]');
const dramaListAll = document.querySelectorAll('[data-dramaList]');//所有顯示戲劇的列表
const hotDramaList = document.querySelector('[data-hotDramaList]');//熱門排行榜
const articlesPreview = document.querySelector('[data-articlesPreview]');//影評文章
const categoryAry = ["愛情","懸疑","社會"];
let articleList = [];
let hotDramas = [];
let loveList = [];
let wishList = [];
function getHotDramas(){
  toggleLoading();
  axios.get(`${baseUrl}/dramas?_sort=rank&_order=desc&_start=0&_end=10`)
  .then((res)=>{
    hotDramas = res.data;
    renderHotDramas(hotDramas);
  })
  .catch((error)=>{
    console.log(error);
  })
  .finally(()=>{
    toggleLoading();
  })
}
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
      // localStorage.removeItem('myCat');
      sweetAlert('登入逾時，請重新登入', 'warning');
      //alert('登入逾時，請重新登入');
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
function renderHotDramas(hotDramas){
  let str = '';
  hotDramaList.innerHTML = '';
  hotDramas.forEach((item)=>{
    const {id, name, img,  type, rank} = item;
    let typeStr = '';
    let favorite = loveList.includes(id)? 'symbols-fill':'';
    let wish = wishList.includes(id)? 'done':'add';
    type.forEach((typeItem)=>{
      typeStr+=`<a href="#" class="btn btn-outline-primary mb-1 tag">${typeItem}</a>`
    })
    str+=`<li class="swiper-slide pb-1">
    <div class="cardImg mb-1">
      <a href="pages/dramaInfo.html?id=${id}"><img src="${img}" onerror="this.src='https://i.imgur.com/azDm8XS.png'" class="dramaImg" alt=""></a>
    </div>
    <h5 class="card-title mb-2"><a href="pages/dramaInfo.html?id=${id}" class="link-darkPrimary">${name}</a></h5>
    ${typeStr}
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex align-items-center">
          <span class="material-symbols-outlined symbols-fill text-primary starIcon">
            star
          </span>
          <span>${rank}</span>
        </div>
        <div>
          <button class="btn btn-outline-secondary rounded-circle me-1 iconLightSecondary material-symbols-outlined ${favorite}" data-id="${id}" data-love="${favorite}">
            favorite
          </button>
          <button class="btn btn-outline-secondary rounded-circle iconLightSecondary add material-symbols-outlined" data-id="${id}" data-wish="${wish}">
              ${wish}
          </button>
        </div>
    </div>
  </li>`;
  });
  hotDramaList.innerHTML = str;
}
function getCategoryDramas(type){
  toggleLoading();
  axios.get(`${baseUrl}/dramas?type_like=${type}&_sort=rank&_order=desc&_start=0&_end=5`)
  .then((res)=>{
    const categoryDramas = res.data;
    renderCategoryDramas(categoryDramas, type);
  })
  .catch((error)=>{
    console.log(error);
  })
  .finally(()=>{
    toggleLoading();
  })
}
function renderCategoryDramas(categoryDramas, type){
  const categoryList = document.querySelector(`[data-category=${type}]`);
  categoryList.innerHTML = '';
  let str = '';
  categoryDramas.forEach((item, index)=>{
    const {id, name, img,  type, rank} = item;
    let typeStr = '';
    let favorite = loveList.includes(id)? 'symbols-fill':'';
    let wish = wishList.includes(id)? 'done':'add';
    type.forEach((typeItem)=>{
      typeStr+=`<a href="#" class="btn btn-outline-primary mb-1 tag">${typeItem}</a>`
    })
    str+=`<li class="swiper-slide pt-2 pb-1">
    <div class="cardImg cardImg-small mb-1">
      <a href="pages/dramaInfo.html?id=${id}"><img src="${img}" onerror="this.src='https://i.imgur.com/azDm8XS.png'" class="dramaImg" alt=""></a>
      <div class="cardRank"><img src="img/rank/${index+1}.svg" alt=""></div>
    </div>
  <h5 class="card-title mb-2"><a href="pages/dramaInfo.html?id=${id}" class="link-darkPrimary">${name}</a></h5>
      ${typeStr}
      <div class="d-flex justify-content-between align-items-start">
        <a href="#" class="d-flex align-items-center star">
          <span class="material-symbols-outlined symbols-fill text-primary starIcon">
            star
          </span>
          <span>${rank}</span>
        </a>
        <div>
        <button class="btn btn-outline-secondary rounded-circle me-1 iconLightSecondary material-symbols-outlined ${favorite}" data-id="${id}" data-love="${favorite}">
        favorite
        </button>
        <button class="btn btn-outline-secondary rounded-circle iconLightSecondary add material-symbols-outlined" data-id="${id}" data-wish="${wish}">
          ${wish}
        </button>
        </div>
      </div>
  </li>`
  })
  categoryList.innerHTML = str;
}
function getArticles(){
  toggleLoading();
  //取最新排序前兩者
    axios.get(`${baseUrl}/articles?_sort=timeStamp&_order=desc&_start=0&_end=2`)
    .then((res)=>{
        articleList = res.data;
        renderArticleList(articleList);
    })
    .catch((error)=>{
        console.log(error);
    })
    .finally(()=>{
      toggleLoading();
    })
}
function renderArticleList(data){
    let str = '';
    data.forEach((item)=>{
    const {author, timeStamp, img, title, content} = item;
    str += `<li class="col-12 card mb-3">
    <div class="row p-3 justify-content-between flex-column-reverse flex-md-row">
      <div class="col-md-9 col-12">
        <div class="card-body">
          <h5 class="card-title text-secondary mb-2"><a href="#" class="link-secondary">${title}</a></h5>
          <p class="card-text text-muted mb-2">
            <span class="me-1">${author}</span>
              |
            <span class="ms-1">${timeStampToTime(timeStamp)}</span>
          </p>
          <p class="card-text mb-2">${content}</p>
          <a href="#" class="link-primary">閱讀更多</a>
        </div>
      </div>
      <div class="col-md-3 col-12 cardImg">
        <a href="#" class="px-1 px-lg-0"><img src="${img}" alt="..." onerror="this.src='https://i.imgur.com/azDm8XS.png'" class="articleImg"></a>
      </div>
    </div>
    </li>`
    })
    articlesPreview.innerHTML = str;

}

function init(){
  
  if(localLoginChecker()){
    renderUserMenu('index');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    getUserLovelist(userId, token);
    getUserWishlist(userId, token);
  }
  setTimeout(()=>{
    getHotDramas();
    for(const category of categoryAry){
      getCategoryDramas(category);
    }
    getArticles();
  }, 200);

}
init();

searchBtn.addEventListener('click',(e)=>{
  const keyword = searchInput.value;
  location.href = `pages/exploreDrama.html?name=${keyword}`;
})
dramaListAll.forEach((item)=>{
  item.addEventListener('click',(e)=>{
    updateList(e);
  })
})



//選擇韓劇種類:
//http://localhost:3000/dramas?type_like=愛情


// 第三人稱復仇
// 殭屍校園
// 惡之花
// 以吾之名
// 惡之花
// 魷魚遊戲
// 模範刑警