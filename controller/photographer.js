let actualPhotographerId = 0;
let ActualPhotographerName = '';
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
        <a href="../index.html?tagname=${tagPhotograph}">
        <li onclick="sortingByTag('${tagPhotograph}')" class="tag__link tag__link--smaller">#${tagPhotograph}</li>
        </a>`).join('')
}
        </ul>
        `;
}

// F06
function mediaTagFactory(mediaToTest) {
  if ('image' in mediaToTest) {
    arrayOfMedias.push({
      id: mediaToTest.id,
      likes: mediaToTest.likes,
      description: mediaToTest.description,
      date: mediaToTest.date,
      src: `../assets/src/Sample_Photos/${ActualPhotographerName}/${mediaToTest.image}`,
      type: 'img',
    });
    return `<img src="../assets/src/Sample_Photos/${ActualPhotographerName}/${mediaToTest.image}" alt="" class="media-photograph__media" onclick="openLightbox();displaySelectedImage(${mediaToTest.id})">`;
  }
  arrayOfMedias.push({
    id: mediaToTest.id,
    likes: mediaToTest.likes,
    description: mediaToTest.description,
    date: mediaToTest.date,
    src: `../assets/src/Sample_Photos/${ActualPhotographerName}/${mediaToTest.video}`,
    type: 'video',
  });
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
    return `
  <article class="media-photograph" data-id="${media.id}" data-date="${media.date}" data-liked="false">
    <div class="media-photograph__cadre">
        ${mediaTagFactory(media)}
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

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________

// F11
// when click on heart icon of .media-photograph, increase number of likes displayed in
// <p> .media-photograph__likes
// argument: is the id of the media created in F06
// first, select .media-photograph with corrsponding data-id, then get <p> .media-photograph__likes
// inside this one, transform text in Int then add 1, then write it with .textContent
function incrementLikes(idOfMedia) {
  const mediaPhotographLiked = document.querySelector(`[data-id='${idOfMedia}']`);
  const numberOfLikesDisplayed = mediaPhotographLiked.querySelector('.media-photograph__likes');
  const isAlreadyLiked = mediaPhotographLiked.dataset.liked;

  if (isAlreadyLiked === 'true') {
    numberOfLikesDisplayed.textContent = parseInt(numberOfLikesDisplayed.textContent, 10) - 1;
    mediaPhotographLiked.setAttribute('data-liked', 'false');
  } else {
    numberOfLikesDisplayed.textContent = parseInt(numberOfLikesDisplayed.textContent, 10) + 1;
    mediaPhotographLiked.setAttribute('data-liked', 'true');
  }
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
function lightboxmediaTagFactory(type, src) {
  const lightboxImage = document.querySelector('.lightbox__media--image');
  const lightboxVideo = document.querySelector('.lightbox__media--video');

  if (type === 'img') {
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
  // eslint-disable-next-line eqeqeq
  const positionInArray = arrayOfMedias.findIndex((media) => media.id == idOfImage);
  const srcOfMedia = arrayOfMedias[positionInArray].src;
  const typeOfMedia = arrayOfMedias[positionInArray].type;
  const descriptionOfMedia = arrayOfMedias[positionInArray].description;

  lightbox.querySelector('.lightbox__description').textContent = descriptionOfMedia;

  lightbox.setAttribute('data-id', idOfImage);

  lightboxmediaTagFactory(typeOfMedia, srcOfMedia);
}

// F16
function showAdjacentImageLightbox(mouvement) {
  const lightboxId = document.querySelector('.lightbox').getAttribute('data-id');
  // eslint-disable-next-line eqeqeq
  let position = arrayOfMedias.findIndex((media) => media.id == lightboxId);
  position += mouvement;
  if (position < 0) {
    position = arrayOfMedias.length - 1;
  } else if (position > arrayOfMedias.length - 1) {
    position = 0;
  }
  const newId = arrayOfMedias[position].id;
  displaySelectedImage(newId);
}

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// MODAL FUNCTIONS AND EVENT

// F17
// put the name of photographer in the title then display the modal
// called with click on .description-photographer__button button
function openModal() {
  document.querySelector('.contact-modal__title').textContent = `Contactez moi ${ActualPhotographerName}`;
  document.querySelector('.contact-modal').style.display = 'flex';
}

// F18
// closingModal
// called with click on contact-modal__cross
function closeModal() {
  document.querySelector('.contact-modal').style.display = 'none';
}

// F19
// On submit, prevent it and display inputs values in log
document.querySelector('.contact-modal').addEventListener('submit', (e) => {
  e.preventDefault();
  const values = document.querySelectorAll('.contact-modal__input');
  values.forEach((el) => console.log(el.value));
});

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
const sortingMediaSelect = document.querySelector('.sorting-media__select');

function sortAndDisplay(propertyName) {
  let orderPosition = 0;
  arrayOfMedias.sort((a, b) => ((a[propertyName] > b[propertyName]) ? 1 : -1));
  arrayOfMedias.forEach((el) => {
    document.querySelector(`[data-id='${el.id}']`).style.order = orderPosition;
    orderPosition += 1;
  });
}

function sortingMedias() {
  switch (sortingMediaSelect.value) {
    case '1':
      sortAndDisplay('likes');
      break;
    case '2':
      sortAndDisplay('date');
      break;
    case '3':
      sortAndDisplay('description');
      break;
    default:
      console.log('0');
  }
}

sortingMediaSelect.addEventListener('change', () => sortingMedias());

// function teste() {
//   arrayOfMedias.forEach((el) => console.log(el))
// }

// document.querySelector('.main').addEventListener('click', () => teste());
