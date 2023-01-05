//import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.6.16/dist/sweetalert2.all.min.js'
import "https://cdn.jsdelivr.net/npm/sweetalert2@11.6.16/dist/sweetalert2.all.min.js";

export function timeStampToTime(timeStamp){
    const date = new Date(timeStamp*1000);//參數放unix時間戳，單位是毫秒，13碼
    const Y = date.getFullYear();
    const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    const D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate();
    return `${Y}-${M}-${D}`
}

export function sweetAlert(text,icon){
  Swal.fire({
      // title: `加入購物車成功`,
      text: text,
      icon: icon,
      confirmButtonText: 'OK',
      width: '28em',
      customClass: {
        confirmButton: 'btn btn-primary rounded-pill px-3',

        //cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
  })
}

export function sweetAlertToast(text, icon, time){
  Swal.fire({
    toast: true,
    position: 'top-end',
    text: text,
    icon: icon,
    timer: time,
    showConfirmButton: false,
});
}

export function toggleLoading(){
  const status = document.querySelector('.status');
  const bg = document.querySelector('.preloader');
  status.classList.toggle("d-block") // 切換class
  bg.classList.toggle("d-block") // 切換class
}

// function toggleLoading(show) {
//   //show的參數，從外部傳入如果是true 就 開啟loading，false 就關閉
//   document.querySelector(".loading").style.display = show ? 'block' : 'none';
// };

export function localLoginChecker() {
    const localJWT = localStorage.getItem('token');
    return localJWT;
    if (localJWT) {
    //   const userMenu = document.querySelector('[data-userMenu]');
    //   const guestMenu = document.querySelector('[data-guestMenu]');
    //   userMenu.classList.remove('d-none');
    //   guestMenu.classList.add('d-none');
      // const nickname = localStorage.getItem('nickname');
      // const avatar = localStorage.getItem('avatar');
      return true
    }else{
        return false
    }
  }
