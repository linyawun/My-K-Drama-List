import {swiperAll} from'./helpers/swiper.js';
const menuIcons = document.querySelectorAll('.navbar-toggler');
    const navbar = document.querySelector('.navbar');
    let isMenuOpen = false;

    menuIcons.forEach((icon)=>{
    icon.addEventListener('click',()=>{
        isMenuOpen = !isMenuOpen
        isMenuOpen ? icon.classList.add('open') : icon.classList.remove('open');
        isMenuOpen ? navbar.classList.add('bg-white') : navbar.classList.remove('bg-white');
    })
})
swiperAll();