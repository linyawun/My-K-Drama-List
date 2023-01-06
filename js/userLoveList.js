import {localLoginChecker, toggleLoading, sweetAlert} from './helpers/util.js'; //載入通用js
import {logout} from './helpers/renderUserMenu.js'; //載入通用js
import {updateList} from './helpers/updateUserList.js';
const userMenu = document.querySelector('[data-userMenu]');
const dramaList = document.querySelector('[data-dramaList]');//所有顯示戲劇的列表
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');
function getUserWishlist(userId, token){
    toggleLoading();
    axios.get(`${baseUrl}/600/users/${userId}/lovelists?_expand=drama`
    ,{
      headers:{
          "authorization": `Bearer ${token}`
      }
    })
    .then((res)=>{
      renderWishList(res.data)
    })
    .catch((error)=>{
      if (error?.response?.status === 401) {
        sweetAlert('登入逾時，請重新登入', 'warning');
        localStorage.clear();
        setTimeout(() => {
            window.location.replace('../../index.html');
        }, 1200);
      }
      console.log(error);
    })
    .finally(()=>{
      toggleLoading();
    })
  };
function renderWishList(data){
    if (data.length==0){
        dramaList.innerHTML = `<h4 class="text-center">最愛清單是空的，試著加入一些韓劇吧!</h4>`;
        return
    } 
    let str = '';
    data.sort(function(a, b) {
        return b.drama.rank - a.drama.rank;
    });
    data.forEach((item)=>{
        const{id, name, img,  type, rank} = item.drama;
        let typeStr = '';
        let favorite = 'symbols-fill';
        type.forEach((typeItem)=>{
            typeStr+=`<a href="#" class="btn btn-outline-primary mb-1 tag">${typeItem}</a>`
        })
        str += `<li class="col-lg-4 col-md-6 mb-4">
        <div class="px-1">
          <div class="cardImg-small mb-1">
            <a href="../dramaInfo.html?id=${id}"><img src="${img}" onerror="this.src='https://i.imgur.com/azDm8XS.png'" class="dramaImg" alt=""></a>
          </div>
          <h5 class="card-title mb-2"><a href="../dramaInfo.html?id=${id}" class="link-darkPrimary">${name}</a></h5>
            ${typeStr}
            <div class="d-flex justify-content-between align-items-start">
              <a href="#" class="d-flex align-items-center star">
                <span class="material-symbols-outlined symbols-fill text-primary starIcon">
                  star
                </span>
                <span>${rank}</span>
              </a>
              <div>
              <button class="btn btn-outline-secondary rounded-circle iconLightSecondary material-symbols-outlined ${favorite}" data-id="${id}" data-love="${favorite}">
                favorite
                </button>
              </div>
            </div>
        </div>       
      </li>`;
    })
    dramaList.innerHTML = str;

}
function init(){
    if(localLoginChecker==false){
        sweetAlert('您的操作錯誤，請登入帳號','error');
        setTimeout(() => {
            location.href = '../../index.html';
        }, 300);
    }
    getUserWishlist(userId, token)
}
init();

userMenu.addEventListener('click', (event) => logout(event));
dramaList.addEventListener('click',(e)=>{
    updateList(e);
})