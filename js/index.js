import {timeStampToTime} from './helpers/util.js'; //載入通用js
const hotDramaList = document.querySelector('.hotDramaList');//熱門排行榜
const articlesPreview = document.querySelector('.articlesPreview');//影評文章
let articleList = [];
let hotDramas = [];
function getDramas(){
  axios.get(`${baseUrl}/dramas?_sort=rank&_order=desc&_start=0&_end=10`)
  .then((res)=>{
    console.log(res.data);
    hotDramas = res.data;
    renderHotDramas(hotDramas);
  })
  .catch((error)=>{
    console.log(error);
  })
}
function renderHotDramas(hotDramas){
  let str = '';
  hotDramas.forEach((item)=>{
    const {id, name, img,  type, rank} = item;
    let typeStr = '';
    type.forEach((typeItem)=>{
      typeStr+=`<a href="#" class="btn btn-outline-primary mb-1 tag">${typeItem}</a>`
    })
    str+=`<li class="swiper-slide pb-1">
    <div class="cardImg mb-1">
      <a href="frontendView/dramaInfo.html?id=${id}"><img src="${img}" class="dramaImg" alt=""></a>
    </div>
    <h5 class="card-title mb-2"><a href="#" class="link-darkPrimary">${name}</a></h5>
    ${typeStr}
    <div class="d-flex justify-content-between align-items-start">
        <div class="d-flex align-items-center">
          <span class="material-symbols-outlined symbols-fill text-primary starIcon">
            star
          </span>
          <span>${rank}</span>
        </div>
        <div>
          <a href="#" class="btn btn-outline-secondary rounded-circle me-1 iconLightSecondary">
            <span class="material-symbols-outlined">
              favorite
            </span>
          </a>
          <a href="#" class="btn btn-outline-secondary rounded-circle iconLightSecondary add">
            <span class="material-symbols-outlined">
              add
            </span>
          </a>
        </div>
    </div>
  </li>`;
  });
  hotDramaList.innerHTML = str;
}
function getArticles(){
  //取最新排序前兩者
    axios.get(`${baseUrl}/articles?_sort=timeStamp&_order=desc&_start=0&_end=2`)
    .then((res)=>{
        console.log(res.data);
        articleList = res.data;
        renderArticleList(articleList);
    })
    .catch((error)=>{
        console.log(error);
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
        <a href="#" class="px-1 px-lg-0"><img src="${img}" alt="..." onerror="this.src='img/img-error.svg'" class="articleImg"></a>
      </div>
    </div>
    </li>`
    })
    articlesPreview.innerHTML = str;

}
function init(){
  // getDramas();
  // getArticles();

}
init();


//選擇韓劇種類:
//http://localhost:3000/dramas?type_like=愛情


// 第三人稱復仇
// 殭屍校園
// 惡之花
// 以吾之名
// 惡之花
// 魷魚遊戲
// 模範刑警