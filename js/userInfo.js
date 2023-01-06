import {localLoginChecker, toggleLoading, sweetAlert} from './helpers/util.js'; //載入通用js
import {logout} from './helpers/renderUserMenu.js'; //載入通用js
import {listenFormInput, renderFormError} from './helpers/validateForm.js';
const userMenu = document.querySelector('[data-userMenu]');
const userInfo = document.querySelector('[data-userInfo]');
const togglePwd = document.querySelectorAll('[data-togglePwd]');
const updatePwdForm = document.querySelector('[data-updatePwd]');
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');
const updatePwdConstraints = {
    oldPassword:{
      presence: {
        message:"必填"
      },
      length: {
        minimum: 8,
        message: "需至少8個字元"
      }
    },
    newPassword:{
       presence:{
        message:"必填"
      },
      length: {
        minimum: 8,
        message: "需至少8個字元"
      }
    },
    checkNewPwd:{
        presence:{
         message:"必填"
       },
       equality: {
         attribute: "newPassword",
         message: "密碼不一致",
       }
     }
  };
let userData = [];
function getUserInfo(){
    toggleLoading();
    axios.get(`${baseUrl}/600/users/${userId}`,
    {
        headers:{
            "authorization": `Bearer ${token}`
        }
    })
    .then((res)=>{
        userData = res.data;
        renderUserInfo(userData);
    })
    .catch((error)=>{
        if (error?.response?.status === 401) {
            console.log(error?.response);
            localStorage.clear();
            sweetAlert('登入逾時，請嘗試重新登入','warning');
            setTimeout(() => {
                location.href = '../../index.html';
            }, 300);
        };
    })
    .finally(()=>{
      toggleLoading();
    })
};
function renderUserInfo(data){
    let str= '';
    const{avatar, nickName, email} = data;
    str+=`<tr>
        <th>頭像</th>
        <td>
          <img src="${avatar}" width="120">
        </td>
      </tr> 
      <tr>
        <th>名稱</th> 
        <td>${nickName}</td>
      </tr> 
      <tr>
        <th>信箱</th> 
        <td>${email}</td>
      </tr> `
    userInfo.innerHTML = str;

}
function updatePassword(data){
    toggleLoading();
    const updateData = data.newPassword;
    axios.patch(`${baseUrl}/600/users/${userId}`,{
        "password": updateData
    },{
        headers:{
            "authorization": `Bearer ${token}`
        }
    })
    .then((response)=>{
        updatePwdForm.reset();
        sweetAlert('更新密碼成功，請重新登入','success');
        localStorage.clear();
        setTimeout(() => {
          location.href = '../../index.html';
        }, 300);
    })
    .catch((error)=>{
        if (error?.response?.status === 401) {
            console.log(error?.response);
            localStorage.clear();
            sweetAlert('登入逾時，請嘗試重新登入','warning');
            setTimeout(() => {
                location.href = '../../index.html';
            }, 300);
        };
    })
    .finally(()=>{
      toggleLoading();
    })
}
function init(){
    if(localLoginChecker==false){
        sweetAlert('您的操作錯誤，請登入帳號','error');
        setTimeout(() => {
          location.href = '../../index.html'
        }, 300);
    }
    getUserInfo();
}
init();
userMenu.addEventListener('click', (event) => logout(event));
togglePwd.forEach((item)=>{
	item.addEventListener('click',(e)=>{
  	const inputPwd = item.previousElementSibling;
    const type = inputPwd.getAttribute('type') === 'password' ? 'text' : 'password'; 
    inputPwd.setAttribute('type', type);
    e.target.textContent = e.target.textContent==="visibility_off"? "visibility": "visibility_off";    
  })
});
updatePwdForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    listenFormInput(updatePwdForm, updatePwdConstraints);//點擊送出後才綁定input change監聽事件，顯示錯誤訊息
    //送出前確認是否符合驗證
    const errors = validate(updatePwdForm, updatePwdConstraints, {fullMessages: false}) || '';
    renderFormError(updatePwdForm, errors);
    if(errors){//有錯誤就不執行後續
      return
    }
    const updatePwdObj = Object.fromEntries(new FormData(updatePwdForm));
    if(updatePwdObj.oldPassword === updatePwdObj.newPassword){
        sweetAlert('新密碼不得與舊密碼相同','warning');
        return 
    }
    updatePassword(updatePwdObj);
  });
