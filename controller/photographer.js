let actualPhotographerId = 0;
let ActualPhotographerName = '';

// _________________________________________________________________________________________________
// DYNAMIC CREATION OF THE PAGE. POPULATE PHOTOGRAPHER & CREATA HTML FOR MEDIAS
//  SEQUENCE OF EXECUTION :

// F05
// function creating HTML and populate it with datas coming from data.json
// argument: an array containing datas about each photographers from json
// firstly, the function get data about the actual photographer using actualPhotographerId variable
// then writing html using thd datas
function createHtmlDescriptionPhotographer(photographer) {
  return `
        <div class="description-photographer__text">
          <h1 class="description-photographer__text__title">${photographer.name}</h1>
          <p class="description-photographer__text__localisation">${photographer.city}, ${photographer.country}</p>
          <p class="description-photographer__text__slogan">${photographer.tagline}</p>
        </div>
        <div class="description-photographer__cadre">
          <img src="../assets/src/Sample_Photos/Photographers_ID_Photos/${photographer.portrait}" alt="" class="description-photographer__image">
        </div>
        <ul class="tag tag--left" aria-label="photographer categories">
        ${photographer.tags.map((tagPhotograph) => `
        <li onclick="sortingByTag('${tagPhotograph}')" data-isChecked="" data-tagName="${tagPhotograph}" class="tag__link tag__link--smaller">#${tagPhotograph}</li>`).join('')
}
        </ul>
        <button class="button">Contactez-moi</button>
        `;
}
// F06
function createHtmlMediaPhotograph(media) {
  // eslint-disable-next-line eqeqeq
  if (media.photographerId == actualPhotographerId) {
    return `
  <article class="media-photograph">
    <div class="media-photograph__cadre">
        <img src="../assets/src/Sample_Photos/${ActualPhotographerName}/${media.image}" alt="" class="media-photograph__image">
    </div>
    <p class="media-photograph__description">${media.description}</p>
    <p class="media-photograph__priceAndLike">${media.price}€ ${media.likes}</p>
    <img src="../assets/src/heart-solid.svg" alt="" class="media-photograph__icon">
  </article>
        `;
  }

  return '';
}

// F07
function mediaPhotographHtmlCompiler(mediaJSON) {
  return mediaJSON.map(createHtmlMediaPhotograph).join('');
}

// F08
// function get id from url then call functions to write html
function photographerPageCreator(data) {
  const url = new URL(document.location.href);
  actualPhotographerId = url.searchParams.get('id');
  // eslint-disable-next-line eqeqeq
  const actualPhotographerDatas = data.photographers.find((el) => el.id == actualPhotographerId);
  ActualPhotographerName = actualPhotographerDatas.name;
  document.querySelector('.description-photographer').innerHTML = createHtmlDescriptionPhotographer(actualPhotographerDatas);
  document.querySelector('.media-photographer-container').innerHTML = mediaPhotographHtmlCompiler(data.media);
}

// F09
// function that get datas in the /src/data.json and chain with .then
// the respons is tranform into json, then the datas received are passed to F07
function fetchDataToCreatePhotographersHTML() {
  fetch('../controller/src/data.json')
    .then((resp) => resp.json())
    .then((data) => photographerPageCreator(data))
    .catch((error) => console.log(`Erreur : ${error}`));
}
fetchDataToCreatePhotographersHTML();
