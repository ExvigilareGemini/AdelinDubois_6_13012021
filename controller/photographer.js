let actualPhotographerId = 0;
let ActualPhotographerName = '';
const actualMediaId = [];
const arrayOfMedias = [];
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// DYNAMIC CREATION OF THE PAGE. POPULATE PHOTOGRAPHER & CREATA HTML FOR MEDIAS
//  SEQUENCE OF EXECUTION :

// F05
// function creating HTML and populate it with datas coming from data.json
// argument: array of objets containing datas about actual photographer
// firstly, it set the price of photographer in the .showing-box
// then writing html using thd datas about actual photographer
function createHtmlDescriptionPhotographer(actualPhotographer) {
  document.querySelector('.showing-box__price').textContent = `${actualPhotographer.price}€ / jour`;
  return `
        <div class="description-photographer__text">
          <h1 class="description-photographer__text__title">${actualPhotographer.name}</h1>
          <p class="description-photographer__text__localisation">${actualPhotographer.city}, ${actualPhotographer.country}</p>
          <p class="description-photographer__text__slogan">${actualPhotographer.tagline}</p>
        </div>
        <button class="description-photographer__button button" onclick="openModal()">Contactez-moi</button>
        <div class="description-photographer__cadre">
          <img src="../assets/src/Sample_Photos/Photographers_ID_Photos/${actualPhotographer.portrait}" alt="" class="description-photographer__image">
        </div>
        <ul class="tag tag--left" aria-label="photographer categories">
        ${actualPhotographer.tags.map((tagPhotograph) => `
        <li onclick="sortingByTag('${tagPhotograph}')" data-isChecked="" data-tagName="${tagPhotograph}" class="tag__link tag__link--smaller">#${tagPhotograph}</li>`).join('')
}
        </ul>
        `;
}

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

// F06
function imageOrVideoTagCreator(mediaToTest) {
  if ('image' in mediaToTest) {
    return `<img src="../assets/src/Sample_Photos/${ActualPhotographerName}/${mediaToTest.image}" alt="" class="media-photograph__media" onclick="openLightbox();displaySelectedImage(${mediaToTest.id})">`;
  }
  return `<video src="../assets/src/Sample_Photos/${ActualPhotographerName}/${mediaToTest.video}" alt="" class="media-photograph__media" onclick="openLightbox();displaySelectedImage(${mediaToTest.id})"></video>`;
}

// F07
// function creating HTML code for one media-photograph
// argument: is an object from JSON containing dats about one media
// firstly testing if media os from actual photographer by checking id, if not ->  return ''
// then create HTML code with template strings using media datas
function createHtmlMediaPhotograph(media) {
  // eslint-disable-next-line eqeqeq
  if (media.photographerId == actualPhotographerId) {
    arrayOfMedias.push({
      id: media.id,
      likes: media.likes,
      description: media.description,
      date: media.date,
    });

    return `
  <article class="media-photograph" id="${media.id}" data-date="${media.date}">
    <div class="media-photograph__cadre">
        ${imageOrVideoTagCreator(media)}
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

// F08
function mediaPhotographHtmlCompiler(mediaJSON) {
  return mediaJSON.map(createHtmlMediaPhotograph).join('');
}

// F09
// function get id from url then call functions to write html
function photographerPageCreator(data) {
  const url = new URL(document.location.href);
  actualPhotographerId = url.searchParams.get('id');
  // eslint-disable-next-line eqeqeq
  const actualPhotographerDatas = data.photographers.find((el) => el.id == actualPhotographerId);
  ActualPhotographerName = actualPhotographerDatas.name;
  document.querySelector('.description-photographer').insertAdjacentHTML('afterbegin', createHtmlDescriptionPhotographer(actualPhotographerDatas));
  document.querySelector('.media-photographer-container').insertAdjacentHTML('afterbegin', mediaPhotographHtmlCompiler(data.media));

  // put id of each media in actualMediaId[] for F16
  const allId = document.querySelectorAll('.media-photograph');
  allId.forEach((el) => actualMediaId.push(el.getAttribute('id')));

  // make sum of likes on each phot and display it, arrayofmedia come from F07
  const totalNumberOfLikes = arrayOfMedias.reduce((a, b) => ({ likes: a.likes + b.likes }));
  document.querySelector('.showing-box__numberOfLike').textContent = totalNumberOfLikes.likes;
}

// F10
// function that get datas in the /src/data.json and chain with .then
// the respons is tranform into json, then the datas received are passed to F07
function fetchDataToCreatePhotographersHTML() {
  fetch('../controller/src/data.json')
    .then((resp) => resp.json())
    .then((data) => photographerPageCreator(data))
    .catch((error) => console.log(`Erreur : ${error}`));
}

fetchDataToCreatePhotographersHTML();
console.log(arrayOfMedias);

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________

// F11
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

// F12
// function that close the lightbox
function closeLightbox() {
  document.querySelector('.lightbox').style.display = 'none';
}

// F13
// function that display the lightbox
function openLightbox() {
  document.querySelector('.lightbox').style.display = 'grid';
}

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________

// F14
function lightboxImageOrVideoTagCreator(media, src) {
  const lightboxImage = document.querySelector('.lightbox__media--image');
  const lightboxVideo = document.querySelector('.lightbox__media--video');

  if (media.tagName === 'IMG') {
    lightboxImage.style.display = 'block';
    lightboxImage.setAttribute('src', src);
    lightboxVideo.style.display = 'none';
  } else {
    lightboxVideo.style.display = 'block';
    lightboxVideo.setAttribute('src', src);
    lightboxImage.style.display = 'none';
  }
}

// F15
function displaySelectedImage(idOfImage) {
  const lightbox = document.querySelector('.lightbox');
  const mediaPhotographSelected = document.getElementById(idOfImage);
  const mediaSelected = mediaPhotographSelected.querySelector('.media-photograph__media');
  const srcAttribute = mediaSelected.getAttribute('src');

  lightbox.setAttribute('id', idOfImage);

  lightboxImageOrVideoTagCreator(mediaSelected, srcAttribute);
}

// F16
function showAdjacentImageLightbox(mouvement) {
  const lightboxId = document.querySelector('.lightbox').getAttribute('id');
  let position = actualMediaId.indexOf(lightboxId);
  position += mouvement;
  if (position < 0) {
    position = actualMediaId.length - 1;
  } else if (position > actualMediaId.length - 1) {
    position = 0;
  }
  const newId = actualMediaId[position];
  displaySelectedImage(newId);
}

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________

// F17
// put the name of photographer in the title then display the modal
function openModal() {
  document.querySelector('.contact-modal__title').textContent = `Contactez moi ${ActualPhotographerName}`;
  document.querySelector('.contact-modal').style.display = 'flex';
}

// F18
function closeModal() {
  document.querySelector('.contact-modal').style.display = 'none';
}

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________

document.querySelector('.contact-modal').addEventListener('submit', (e) => {
  e.preventDefault();
  const values = document.querySelectorAll('.contact-modal__input');
  values.forEach((el) => console.log(el.value));
});

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________

const sortingMediaSelector = document.querySelector('.sorting-media__select');
sortingMediaSelector.addEventListener('change', () => console.log(sortingMediaSelector.value));
// document.querySelector('.main').addEventListener('click', () => );

function test() {
  console.log(arrayOfMedias.sort((a, b) => a.id - b.id));
}
