// http://127.0.0.1:5501/frontendView/dramaInfo.html?id=2
const id = location.href.split("=")[1];
const dramaTitle = document.querySelector('.dramaTitle');
const dramaInfo = document.querySelector('.dramaInfo');
let dramaObj = [];
console.log(dramaInfo);
function getDramaInfo(id){
    axios.get(`${baseUrl}/dramas/${id}`)
    .then((response)=>{
        console.log(response.data);
        dramaObj = response.data;
        renderDramaData(dramaObj);
        // document.querySelector("h1").textContent = response.data.id
        // document.querySelector(".content").textContent = response.data.content
    })
    .catch((error)=>{
        console.log(error);
    })
}
function renderDramaData(dramaObj){
    const {name, img, year, type, intro, dramaSynopsis, rank, characters, wiki, ostLink} = dramaObj;
    let typeStr = '';
    let charactersStr = '';
    type.forEach((typeItem)=>{
        typeStr+=`<a href="#" class="btn btn-outline-primary mb-1 tag">${typeItem}</a>`;
    })
    characters.forEach((characterItem)=>{
        const {actor, character, characterIntro} = characterItem;
        charactersStr+=`<tr>
        <td>${actor}</td>
        <td>${character}</td>
        <td>${characterIntro}
        </td>
      </tr>`;
    })
    const titleStr = `
    <div class="cardImg mb-1">
    <img src="${img}" class="dramaImg" alt="">
    </div>
    <div class="mb-6">
        <div class="d-flex">
        <h2 class="card-title me-3">${name}</h2>
        <div class="d-flex align-items-center">
            <span class="material-symbols-outlined symbols-fill text-primary starIcon">
            star
            </span>
            <span>${rank}</span>
        </div>
        </div>
        ${typeStr}
        <div class="d-flex justify-content-start align-items-center">
        <div>
            <a href="#" class="btn btn-outline-secondary rounded-pill me-1 bg-lightSecondary text-secondary border-0">
            <span>
                評分
            </span>
            </a>
            <a href="#" class="btn btn-outline-secondary rounded-circle me-1 iconLightSecondary">
            <span class="material-symbols-outlined">
                favorite
            </span>
            </a>
            <a href="#" class="btn btn-outline-secondary rounded-circle iconLightSecondary">
            <span class="material-symbols-outlined">
                add
            </span>
            </a>
        </div>
        </div>
    </div>
    `;
    const infoStr = `
    <p>年份：${year}</p>
    <h6 class="text-secondary mb-1">基本介紹</h6>
    <p class="ms-2 mb-3">${intro}</p>
    <h6 class="text-secondary mb-1">劇情介紹</h6>
    <p class="ms-2 mb-3">${dramaSynopsis}</p>
    <h6 class="text-secondary mb-1">角色介紹</h6>
    <div class="table-responsive ms-2 me-1 mb-3">
      <table class="table">
        <thead>
          <tr class="table-primary">
            <th scope="col" width="8%">演員</th>
            <th scope="col" width="8%">角色</th>
            <th scope="col" width="84%">介紹</th>
          </tr>
        </thead>
        <tbody>
          ${charactersStr}
        </tbody>
      </table>
    </div>
    <h6 class="text-secondary mb-1">Original Sound Track (OST)</h6>
    <div class="row mb-4">
      <div class="col-lg-6 col-12">
        <div class="video-container ms-2">
          <iframe width="560" height="315" src="${ostLink+"?rel=0"}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      </div>
    </div>
    <div class="text-center"><a href="${wiki}" target="_blank" class="btn btn-outline-darkSecondary rounded-pill">更多資訊</a></div>
    `;
    dramaTitle.innerHTML = titleStr;
    dramaInfo.innerHTML = infoStr;
    document.querySelector('[data-title]').textContent = name;
}
function init(){
    getDramaInfo(id);
}
init();
