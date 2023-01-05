
import {sweetAlert, sweetAlertToast, toggleLoading} from './helpers/util.js'
import {listenFormInput, renderFormError} from './helpers/validateForm.js';
const signUpForm = document.querySelector('[data-signUpForm]');
const signinForm = document.querySelector('[data-signinForm]');
const togglePwd = document.querySelectorAll('[data-togglePwd]');
const signupConstraints = {
  name:{
    presence: {
      message:"必填"
    }
  },
  email:{
    presence:{
      message:"必填"
    },
    format: {
      pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      message: "格式錯誤，需有@與.等符號"
   }
  },
  password:{
    presence:{
      message:"必填"
    },
    length: {
      minimum: 8,
      message: "需至少8個字元"
    }
  },
  passwordCheck:{
     presence:{
      message:"必填"
    },
    equality: {
      attribute: "password",
      message: "密碼不一致",
    }
  },
  agreeCheck:{
    presence:{
      message:"必填"
    },
    inclusion: {
      within: [true],
      message: "請勾選"
    }
  }
};
const signinConstraints = {
  email:{
    presence:{
      message:"必填"
    },
    format: {
      pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      message: "格式錯誤，需有@與.等符號"
   }
  },
  password:{
    presence:{
      message:"必填"
    },
    length: {
      minimum: 8,
      message: "需至少8個字元"
    }
  }
};

function signup(data){
  const signupData = {
    "email": data.email,
    "password": data.password,
    "nickName": data.name,
    "avatar": "https://i.imgur.com/9WzMNQ4.png"
  };
  toggleLoading();
  axios.post(`${baseUrl}/signup`,signupData)
  .then((response)=>{
      console.log(response.data);
      sweetAlert("註冊成功，請登入","success");
      //alert("註冊成功，請登入");
      signUpForm.reset();
      // setTimeout(() => {
      //   window.location.replace('../pages/login.html');
      // }, 1200);
  })
  .catch((error)=>{
      console.log(error.response);
      if(error.response.data=='Email already exists'){
        sweetAlert('此信箱已註冊', 'error')
      }else{
        sweetAlert(`${error.response.data}`, 'error')
        //alert(`${error.response.data}`);
      }
  })
  .finally(()=>{
    toggleLoading();
  })
}
function saveUserToLocal({ accessToken, user }) {
  // const now = Date.now();
  // const expired = now + 1 * 1000 * 60 * 60;
  // // const isLogin = expired > now;

  // localStorage.setItem('expired', expired);

  localStorage.setItem('token', accessToken);
  localStorage.setItem('userId', user.id);
  //localStorage.setItem('nickName', user.nickName);
  //localStorage.setItem('avatar', user.avatar);
}
function signin(data){
  const signinData = {
    "email": data.email,
    "password": data.password
  };
  toggleLoading();
  axios.post(`${baseUrl}/login`,signinData)
  .then((response)=>{
      sweetAlertToast("登入成功",'success',1500);
      saveUserToLocal(response.data);
      setTimeout(() => {
        //window.location.replace('/'); //local路徑
        window.location.replace('/My-K-Drama-List/index.html'); //github page路徑
      }, 1500);//跳轉到首頁
      //console.log(response.data);
      //signinForm.reset();
  })
  .catch((error)=>{
    if(error.response.data=='Cannot find user'){
      sweetAlert('此帳號不存在', 'error');
      //alert('此帳號不存在');
    }else if(error.response.data=='Incorrect password'){
      sweetAlert('密碼錯誤', 'error');
      //alert('密碼錯誤');
    }else{
      sweetAlert(`${error.response.data}`, 'error')
      //alert(`${error.response.data}`);
    }
  })
  .finally(()=>{
    toggleLoading();
  })
}


//密碼的visibility顯示與否的監聽事件
togglePwd.forEach((item)=>{
	item.addEventListener('click',(e)=>{
  	const inputPwd = item.previousElementSibling;
    const type = inputPwd.getAttribute('type') === 'password' ? 'text' : 'password'; 
    inputPwd.setAttribute('type', type);
    e.target.textContent = e.target.textContent==="visibility_off"? "visibility": "visibility_off";    
  })
})

signUpForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  listenFormInput(signUpForm, signupConstraints);//點擊送出後才綁定input change監聽事件，顯示錯誤訊息
  //送出前確認是否符合驗證
  const errors = validate(signUpForm, signupConstraints, {fullMessages: false}) || '';
  renderFormError(signUpForm, errors);
  if(errors){//有錯誤就不執行後續
    return
  }

  const signUpData = new FormData(signUpForm);
  const signUpObj = Object.fromEntries(signUpData);
  //console.log(signUpObj)
  signup(signUpObj);
})

signinForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  listenFormInput(signinForm, signinConstraints);//點擊送出後才綁定input change監聽事件，顯示錯誤訊息
  //送出前確認是否符合驗證
  const errors = validate(signinForm, signinConstraints, {fullMessages: false}) || '';
  renderFormError(signinForm, errors);
  if(errors){//有錯誤就不執行後續
    return
  }

  const signinData = new FormData(signinForm);
  const signinObj = Object.fromEntries(signinData);
  signin(signinObj);
});

