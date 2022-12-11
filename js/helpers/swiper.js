const hotSwiper = () => new Swiper(".hotSwiper", {
    // slidesPerView: 3,
    // spaceBetween: 30,
    loop: true,
    grabCursor: true,
    
    autoplay:{
    delay: 5000,
    disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-Pagination",
      type: "fraction",
    },
    navigation: {
      nextEl: ".swiper-buttonNext",
      prevEl: ".swiper-buttonPrev",
    },
    breakpoints: {
    375: {
      slidesPerView: 1,
      spaceBetween: 15,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 25,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
  });

const scrollSwiper = () => new Swiper(".categorySwiper", {
    slidesPerView: 5,
    spaceBetween: 30,
    mousewheel: true,
    grabCursor: true,
    scrollbar: {
      el: ".swiper-scrollbar",
    },
    breakpoints: {
    375: {
      slidesPerView: 1,
      spaceBetween: 15,
    },
    414: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 25,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
    1200: {
      slidesPerView: 5,
      spaceBetween: 30,
    },
  }
  });

export function swiperAll(){
  hotSwiper();
  scrollSwiper();
}

