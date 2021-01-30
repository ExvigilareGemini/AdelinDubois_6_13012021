let actualPhotographerId = 0;
let ActualPhotographerName = '';
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
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

// class Photo {
//   constructor() {
//     this.type = 'photo';
//     this.create = function (mediaImage) {
//       return `<img src="../assets/src/Sample_Photos/${ActualPhotographerName}/${mediaImage}" alt="" class="media-photograph__media">`;
//     };
//   }
// }

// class Video {
//   constructor() {
//     this.type = 'video';
//     this.create = function (mediaImage) {
//       return `<video src="../assets/src/Sample_Photos/${ActualPhotographerName}/${mediaImage}" alt="" class="media-photograph__media" controls></video>`;
//     };
//   }
// }

// class MediaFactory {
//   constructor() {
//     this.createMediaHTML = function (type) {
//       let media;
//       if (type === 'jpg') {
//         media = new Photo();
//       } else if (type === 'mp4') {
//         media = new Video();
//       }
//       return media;
//     };
//   }
// }

function isImageOrVideo(mediaToTest) {
  if ('image' in mediaToTest) {
    return `<img src="../assets/src/Sample_Photos/${ActualPhotographerName}/${mediaToTest.image}" alt="" class="media-photograph__media" onclick="openLightbox()">`;
  }
  return `<video src="../assets/src/Sample_Photos/${ActualPhotographerName}/${mediaToTest.video}" alt="" class="media-photograph__media" controls></video>`;
}

// Pour pouvoir utiliser le factory il faudrait vérifier que le nom dans le JSON est soit image ou video

// F06
function createHtmlMediaPhotograph(media) {
  // eslint-disable-next-line eqeqeq
  if (media.photographerId == actualPhotographerId) {
    return `
  <article class="media-photograph" id="${media.id}">
    <div class="media-photograph__cadre">
        ${isImageOrVideo(media)}
    </div>
    <p class="media-photograph__description">${media.description}</p>
    <p class="media-photograph__price">${media.price}€</p>
    <p class="media-photograph__likes">${media.likes}</p>
    <i class="fas fa-heart media-photograph__icon" aria-label="likes" onclick="incrementLikes(${media.id})"></i>
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

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// when click on heart icon of .media-photograph, increase number of likes displayed in
// <p> .media-photograph__likes
// argument: is the id of the media created in F06
// firstly, select .media-photograph with corrsponding id, then select <p> .media-photograph__likes
// inside this one, transform text in Int then add 1, then write it with .textContent
function incrementLikes(idOfMedia) {
  const mediaPhotographLiked = document.getElementById(idOfMedia);
  const likesDisplayed = mediaPhotographLiked.querySelector('.media-photograph__likes');
  likesDisplayed.textContent = parseInt(likesDisplayed.textContent, 10) + 1;
}

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
function closeLightbox() {
  document.querySelector('.lightbox').style.display = 'none';
}
function openLightbox() {
  document.querySelector('.lightbox').style.display = 'grid';
}