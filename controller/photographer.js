let actualPhotographerId = 0;

// _________________________________________________________________________________________________
// DYNAMIC CREATION OF THE PAGE. POPULATE PHOTOGRAPHER & CREATA HTML FOR MEDIAS
//  SEQUENCE OF EXECUTION :

// F05
// function creating HTML and populate it with datas coming from data.json
// argument: an array containing datas about each photographers from json
// firstly, the function get data about the actual photographer using actualPhotographerId variable
// then writing html using thd datas
function createHtmlDescriptionPhotographer(photographers) {
  // eslint-disable-next-line eqeqeq
  const actualPhotographerDatas = photographers.find((el) => el.id == actualPhotographerId);
  return `
        <div class="description-photographer__text">
          <h1 class="description-photographer__text__title">${actualPhotographerDatas.name}</h1>
          <p class="description-photographer__text__localisation">${actualPhotographerDatas.city}, ${actualPhotographerDatas.country}</p>
          <p class="description-photographer__text__slogan">${actualPhotographerDatas.tagline}</p>
        </div>
        <div class="description-photographer__cadre">
          <img src="../assets/src/Sample_Photos/Photographers_ID_Photos/${actualPhotographerDatas.portrait}" alt="" class="description-photographer__image">
        </div>
        <ul class="tag tag--left" aria-label="photographer categories">
        ${actualPhotographerDatas.tags.map((tagPhotograph) => `
        <li onclick="sortingByTag('${tagPhotograph}')" data-isChecked="" data-tagName="${tagPhotograph}" class="tag__link tag__link--smaller">#${tagPhotograph}</li>`).join('')
}
        </ul>
        <button class="button">Contactez-moi</button>
        `;
}

// F07
// function get id from url then call functions to write html
function photographerPageCreator(data) {
  const url = new URL(document.location.href);
  actualPhotographerId = url.searchParams.get('id');
  document.querySelector('.description-photographer').innerHTML = createHtmlDescriptionPhotographer(data.photographers);
}

// F0
// function that get datas in the /src/data.json and chain with .then
// the respons is tranform into json, then the datas received are passed to F07
function fetchDataToCreatePhotographersHTML() {
  fetch('../controller/src/data.json')
    .then((resp) => resp.json())
    .then((data) => photographerPageCreator(data))
    .catch((error) => console.log(`Erreur : ${error}`));
}
fetchDataToCreatePhotographersHTML();
