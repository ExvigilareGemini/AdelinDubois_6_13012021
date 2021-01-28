let actualPhotographerId = 0;

// _________________________________________________________________________________________________
// DYNAMIC CREATION OF THE PAGE. POPULATE PHOTOGRAPHER & CREATA HTML FOR MEDIAS
//  SEQUENCE OF EXECUTION :

function createHtmlDescriptionPhotographer(photographers) {
  // eslint-disable-next-line eqeqeq
  const actualPhotographerDatas = photographers.find((el) => el.id == actualPhotographerId);
  return `
        <header class="description-photographer__header">
            <h1 class="description-photographer__header__title">${actualPhotographerDatas.name}</h1>
        </header>
        <div class="description-photographer__text">
            <p class="description-photographer__text__localisation">${actualPhotographerDatas.city}</p>
            <p class="description-photographer__text__slogan">${actualPhotographerDatas.tagline}</p>
        </div>
        <ul class="tag" aria-label="photographer categories">
        ${actualPhotographerDatas.tags.map((tagPhotograph) => `
        <li onclick="sortingByTag('${tagPhotograph}')" data-isChecked="" data-tagName="${tagPhotograph}" class="tag__link tag__link--smaller">#${tagPhotograph}</li>`).join('')
}
        <button class="description-photographer__button">Contactez-moi</button>
        <img src="../assets/src/Sample_Photos/Photographers_ID_Photos/${actualPhotographerDatas.portrait}" alt="" class="description-photographer__image">`;
}

function photographerPageCreator(data) {
  const url = new URL(document.location.href);
  actualPhotographerId = url.searchParams.get('id');
  document.querySelector('.description-photographer').innerHTML = createHtmlDescriptionPhotographer(data.photographers);
}

// F0
// function that get datas in the /src/data.json and chain with .then
// the respons is tranform into json, then the datas received are passed to F03
function fetchDataToCreatePhotographersHTML() {
  fetch('../controller/src/data.json')
    .then((resp) => resp.json())
    .then((data) => photographerPageCreator(data))
    .catch((error) => console.log(`Erreur : ${error}`));
}
fetchDataToCreatePhotographersHTML();
