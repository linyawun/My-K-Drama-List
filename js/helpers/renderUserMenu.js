import {sweetAlertToast} from './util.js'
const guestMenu = document.querySelector('[data-guestMenu]');
function templateOfUserMenu(location, template = '') {
  let path = location=='index'? 'pages/':'';
 template += `
  <li class="nav-item p-lg-0 px-2 dropdown">
    <a class="nav-link py-lg-1 px-2 py-3 dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
      會員專區
    </a>
    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
      <li><a class="dropdown-item" href="${path}user/userInfo.html">會員資料</a></li>
      <li><a class="dropdown-item" href="${path}user/userWishList.html">我的待看清單</a></li>
      <li><a class="dropdown-item" href="${path}user/userLoveList.html">我的最愛清單</a></li>
      <li><a class="dropdown-item" data-logout href="#">登出</a></li>
    </ul>
  </li>
    `;
  
    return template;
  }
export function logout(event) {
    if(event.target.hasAttribute('data-logout')==false){
        return
    }
    // const target = event.target;
    // console.log('target:::', target);
    // const targetBtn = event.target.closest('.js-logout');
    // console.log('targetBtn:::', targetBtn);
    // if (!targetBtn) {
    //   return;
    // }
  
    localStorage.clear();
    sweetAlertToast('已登出','success', 1500)
    //alert('已登出');
    setTimeout(() => {
      window.location.replace('/index.html');
    }, 1500);
}

export function renderUserMenu(location=''){
    guestMenu.innerHTML = templateOfUserMenu(location);
    guestMenu.addEventListener('click', (event) => logout(event));
}
