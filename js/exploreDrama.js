import {localLoginChecker, toggleLoading} from './helpers/util.js'; //載入通用js
import {renderUserMenu} from './helpers/renderUserMenu.js'; //載入通用js
import {updateList} from './helpers/updateUserList.js';
const searchResult = document.querySelector('[data-searchResult]');
const dramaTypeInput = document.querySelector('#dramaType');
const dramaNameInput = document.querySelector('#dramaName');
const searchForm = document.querySelector('.searchForm');
let dramaList = [];
let loveList = [];
let wishList = [];
$(function () {
    $('select').selectpicker();
});
function getDramas(requirement=null){
    if(requirement==null){
        axios.get(`${baseUrl}/dramas?_sort=rank&_order=desc`)
        .then((res)=>{
          dramaList = res.data;
          renderDramas(dramaList);
        })
        .catch((error)=>{
          console.log(error);
        })
    }else{
        let {dramaName, dramaType, dramaYear, dramaRank} = requirement;
        dramaName = dramaName==undefined? '':dramaName;
        dramaYear = dramaYear=='不限'? '':dramaYear;
        dramaRank = dramaRank=='不限'? '':dramaRank;
        //將類型整理為字串
        let dramaTypeStr = '';
        dramaType.forEach((item)=>{
            dramaTypeStr+=`type_like=${item}&`
        })
        const url = `${baseUrl}/dramas?name_like=${dramaName}&${dramaTypeStr}year_gte=${dramaYear}&rank_gte=${dramaRank}&_sort=rank&_order=desc`;
        toggleLoading();
        axios.get(url)
            .then((res)=>{
              renderDramas(res.data);
            })
            .catch((error)=>{
              console.log(error);
            })
            .finally(()=>{
              toggleLoading();
            })
    }

};
function getUserList(userId, token){
  toggleLoading();
  Promise.all([
  axios.get(`${baseUrl}/600/users/${userId}/lovelists`
  ,{
    headers:{
        "authorization": `Bearer ${token}`
    }
  }),
  axios.get(`${baseUrl}/600/users/${userId}/wishlists`
  ,{
    headers:{
        "authorization": `Bearer ${token}`
    }
  })
])
  .then((resAry) => {
    loveList = resAry[0].data.map((item)=>item.dramaId);
    wishList = resAry[1].data.map((item)=>item.dramaId);

    checkUrl(); 
  })
  .catch(error => {
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
}

function renderDramas(data){
    if (data.length==0){
        searchResult.innerHTML = `<h4 class="text-center">沒有符合條件的搜尋結果，試著放寬條件吧!</h4>`;
        return
    } 
    let str = '';
    data.forEach((item)=>{
        const {id, name, img,  type, rank} = item;
        let typeStr = '';
        let favorite = loveList.includes(id)? 'symbols-fill':'';
        let wish = wishList.includes(id)? 'done':'add';
        type.forEach((typeItem)=>{
          typeStr+=`<a href="#" class="btn btn-outline-primary mb-1 tag">${typeItem}</a>`
        })
        str += `<li class="col-lg-4 col-md-6 mb-4">
        <div class="px-1">
          <div class="cardImg-small mb-1">
            <a href="../pages/dramaInfo.html?id=${id}"><img src="${img}" onerror="this.src='https://i.imgur.com/azDm8XS.png'" class="dramaImg" alt=""></a>
          </div>
          <h5 class="card-title mb-2"><a href="../pages/dramaInfo.html?id=${id}" class="link-darkPrimary">${name}</a></h5>
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
        </div>       
      </li>`;
    })
    searchResult.innerHTML = str;
};
function resetForm(){
    $('#dramaType').selectpicker('val',['noneSelectedText']);
    $('#dramaYear').selectpicker('val','不限');
    $('#dramaRank').selectpicker('val','不限');
    searchForm.reset();
}
function checkUrl(){
  let dramaName;
  let dramaType = [];
  const args = location.href.split("?")[1];
  if(args==undefined){
    //沒有參數
  }
  else if(args.split("=")[0]=="name"){
      dramaName = location.href.split("=")[1];
  }else if(args.split("=")[0]=="type"){
      dramaType = [location.href.split("=")[1]];
  }

  if(dramaType.length == 0 && dramaName == undefined){
        getDramas();
  }else{
      const requirement = {
          "dramaName": dramaName,
          "dramaType": dramaType,
          "dramaYear": '',
          "dramaRank": '' 
      };
      if(dramaType.length!=0){
        $('.selectpicker').selectpicker('val', decodeURI(dramaType)); //類型填入input欄位
      }
      dramaNameInput.value = dramaName==undefined? '':decodeURI(dramaName);//將名稱填入input欄位
      getDramas(requirement);
  }
}
function init(){
  if(localLoginChecker()){
    renderUserMenu();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    getUserList(userId, token);//取得會員最愛和蒐藏清單後，再checkUrl
  }else{
    checkUrl(); 
  }  

}
init();

searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const formData = new FormData(searchForm);
    const inputObject = Object.fromEntries(formData);
    //整理類型的值 轉為陣列
    inputObject.dramaType = [];
    for (const [key, value] of formData) {
        if(key=='dramaType'){
            inputObject.dramaType.push(value);
        }
    }
    getDramas(inputObject);
    // resetForm();
})

searchResult.addEventListener('click',(e)=>{
    updateList(e);
})