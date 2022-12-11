import {swiperAll} from'./helpers/swiper.js';
const menuIcons = document.querySelectorAll('.navbar-toggler');
    let isMenuOpen = false;

    menuIcons.forEach((icon)=>{
    icon.addEventListener('click',()=>{
        isMenuOpen = !isMenuOpen
        isMenuOpen ? icon.classList.add('open') : icon.classList.remove('open');
    })
})
swiperAll();