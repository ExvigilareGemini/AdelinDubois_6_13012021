let actualPhotographerId = 0;
let ActualPhotographerName = '';
const arrayOfMedias = [];
const mainHTML = document.querySelector('.main');
const headerHTML = document.querySelector('.header');
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
        <button class="description-photographer__button button" onclick="openModal()" type="button" aria-label="Contact me">Contactez-moi</button>
        <div class="description-photographer__cadre">
          <img src="../assets/src/Sample_Photos/Photographers_ID_Photos/${actualPhotographer.portrait}" alt="${actualPhotographer.name}" class="description-photographer__image">
        </div>
        <nav class="tag tag--left" aria-label="photographer categories">
        ${actualPhotographer.tags.map((tagPhotograph) => `
        <a href="../index.html?tagname=${tagPhotograph}" aria-label="tag ${tagPhotograph}" class="tag__link tag__link--smaller">#${tagPhotograph}</a>`).join('')
}
        </nav>
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
    return `<img tabindex="0" src="../assets/src/Sample_Photos/${ActualPhotographerName}/${mediaToTest.image}" alt="Description of the image, closeup view" class="media-photograph__media" onclick="openLightbox(${mediaToTest.id})" data-id="${mediaToTest.id}">`;
  }
  arrayOfMedias.push({
    id: mediaToTest.id,
    likes: mediaToTest.likes,
    description: mediaToTest.description,
    date: mediaToTest.date,
    src: `../assets/src/Sample_Photos/${ActualPhotographerName}/${mediaToTest.video}`,
    type: 'video',
  });
  return `<video tabindex="0" src="../assets/src/Sample_Photos/${ActualPhotographerName}/${mediaToTest.video}" aria-label="Description of the video, closeup view" class="media-photograph__media" onclick="openLightbox(${mediaToTest.id})" data-id="${mediaToTest.id}"></video>`;
}

// F07
// function creating HTML code for one media-photograph
// argument: is an object from JSON containing dats about one media
// firstly testing if media os from actual photographer by checking id, if not ->  return ''
// then create HTML code with template strings using media datas
function createHtmlMediaPhotograph(media) {
  if (media.photographerId == actualPhotographerId) {
    return `
  <article class="media-photograph" data-id="${media.id}" data-date="${media.date}" data-liked="false">
    ${mediaTagFactory(media)}
    <div class="media-photograph__text-container">
        <p class="media-photograph__description">${media.description}</p>
        <p class="media-photograph__price">${media.price}€</p>
        <p class="media-photograph__likes">${media.likes}</p>
        <i tabindex="0" class="fas fa-heart media-photograph__icon" aria-label="like button" onclick="incrementLikes(${media.id})"></i>
    </div>
  </article>
        `;
  }

  return '';
}

// F08
function mediaPhotographHtmlCompiler(mediaJSON) {
  return mediaJSON.map(createHtmlMediaPhotograph).join('');
}

function displayTotalNumberOfLikes() {
  const totalNumberOfLikes = arrayOfMedias.reduce((a, b) => ({ likes: a.likes + b.likes }));
  document.querySelector('.showing-box__numberOfLike').textContent = totalNumberOfLikes.likes;
}
function displayTitleOfPage() {
  document.querySelector('.title').textContent = ActualPhotographerName;
}

// F09
// function get id from url then call functions to write html
function photographerPageCreator(data) {
  const url = new URL(document.location.href);
  actualPhotographerId = url.searchParams.get('id');
  const actualPhotographerDatas = data.photographers.find((el) => el.id == actualPhotographerId);
  ActualPhotographerName = actualPhotographerDatas.name;
  document.querySelector('.description-photographer').insertAdjacentHTML('afterbegin', createHtmlDescriptionPhotographer(actualPhotographerDatas));
  document.querySelector('.media-photographer-container').insertAdjacentHTML('afterbegin', mediaPhotographHtmlCompiler(data.media));

  displayTotalNumberOfLikes();
  displayTitleOfPage();
  openLightboxOnEnterKey();
  incrementLikesOnEnterKey();
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
  const numberOfLikeForThisMedia = arrayOfMedias.find((el) => el.id == idOfMedia);

  if (isAlreadyLiked === 'true') {
    numberOfLikesDisplayed.textContent = parseInt(numberOfLikesDisplayed.textContent, 10) - 1;
    mediaPhotographLiked.setAttribute('data-liked', 'false');
    numberOfLikeForThisMedia.likes -= 1;
  } else {
    numberOfLikesDisplayed.textContent = parseInt(numberOfLikesDisplayed.textContent, 10) + 1;
    mediaPhotographLiked.setAttribute('data-liked', 'true');
    numberOfLikeForThisMedia.likes += 1;
  }
  displayTotalNumberOfLikes();
}

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________

// F14
function lightboxmediaTagFactory(type, src, description) {
  const lightboxImage = document.querySelector('.lightbox__media--image');
  const lightboxVideo = document.querySelector('.lightbox__media--video');

  if (type === 'img') {
    lightboxImage.style.display = 'block';
    lightboxImage.setAttribute('src', src);
    lightboxImage.setAttribute('alt', description);
    lightboxVideo.style.display = 'none';
  } else {
    lightboxVideo.style.display = 'block';
    lightboxVideo.setAttribute('src', src);
    lightboxImage.setAttribute('aria-label', description);
    lightboxImage.style.display = 'none';
  }
}

// F15
function displaySelectedImage(idOfImage) {
  const lightbox = document.querySelector('.lightbox');
  const positionInArray = arrayOfMedias.findIndex((media) => media.id == idOfImage);
  const srcOfMedia = arrayOfMedias[positionInArray].src;
  const typeOfMedia = arrayOfMedias[positionInArray].type;
  const descriptionOfMedia = arrayOfMedias[positionInArray].description;

  lightbox.querySelector('.lightbox__description').textContent = descriptionOfMedia;

  lightbox.setAttribute('data-id', idOfImage);

  lightboxmediaTagFactory(typeOfMedia, srcOfMedia, descriptionOfMedia);
}

// F16
function showAdjacentImageLightbox(mouvement) {
  const lightboxId = document.querySelector('.lightbox').getAttribute('data-id');
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

function accessibilityAriaModification(mainHeaderAriaHidden, modalAriaHidden, className) {
  mainHTML.setAttribute('aria-hidden', mainHeaderAriaHidden);
  headerHTML.setAttribute('aria-hidden', mainHeaderAriaHidden);
  document.querySelector(className).setAttribute('aria-hidden', modalAriaHidden);
}

// F12
// function that close the lightbox
function closeLightbox() {
  accessibilityAriaModification('false', 'true', '.lightbox');
  document.querySelector('.lightbox').style.display = 'none';
  document.querySelector(`.media-photograph__media[data-id="${document.querySelector('.lightbox').dataset.id}"]`).focus();
}

// F13
// function that display the lightbox
function openLightbox(idOfImage) {
  accessibilityAriaModification('true', 'false', '.lightbox');
  document.querySelector('.lightbox').style.display = 'grid';
  document.querySelector('.lightbox__cross').focus();
  displaySelectedImage(idOfImage);
}

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// MODAL FUNCTIONS AND EVENT

function modalBackgroundDesactivated(opacityValue, pointerEventValue) {
  mainHTML.style.opacity = opacityValue;
  mainHTML.style.pointerEvents = pointerEventValue;
  headerHTML.style.opacity = opacityValue;
  headerHTML.style.pointerEvents = pointerEventValue;
}

// F17
// put the name of photographer in the title then display the modal
// called with click on .description-photographer__button button
function openModal() {
  modalBackgroundDesactivated('0.5', 'none');
  accessibilityAriaModification('true', 'false', '.modal');
  document.querySelector('.contact-modal__title').textContent = `Contactez moi ${ActualPhotographerName}`;
  document.querySelector('.contact-modal').style.display = 'flex';
  document.querySelector('.contact-modal__cross').focus();
}

// F18
// closingModal
// called with click on contact-modal__cross
function closeModal() {
  modalBackgroundDesactivated('1', 'auto');
  accessibilityAriaModification('false', 'true', '.modal');
  document.querySelector('.contact-modal').style.display = 'none';
  document.querySelector('.description-photographer__button').focus();
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
    const mediaSortAndDisplay = document.querySelector(`[data-id='${el.id}']`);
    mediaSortAndDisplay.querySelector('.media-photograph__media').setAttribute('tabindex', orderPosition);
    mediaSortAndDisplay.querySelector('.media-photograph__icon').setAttribute('tabindex', orderPosition);
    mediaSortAndDisplay.style.order = orderPosition;
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

document.addEventListener('keydown', (event) => {
  const modalAriaHidden = document.querySelector('.modal').getAttribute('aria-hidden');
  const lightboxAriaHidden = document.querySelector('.lightbox').getAttribute('aria-hidden');

  switch (event.code) {
    case 'Escape':
      if (modalAriaHidden === 'false') {
        closeModal();
      } else if (lightboxAriaHidden === 'false') {
        closeLightbox();
      }
      break;
    case 'ArrowLeft':
      if (lightboxAriaHidden === 'false') {
        showAdjacentImageLightbox(-1);
      }
      break;
    case 'ArrowRight':
      if (lightboxAriaHidden === 'false') {
        showAdjacentImageLightbox(1);
      }
      break;
    default:
  }
});

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
function openLightboxOnEnterKey() {
  document.querySelectorAll('.media-photograph__media').forEach((el) => {
    el.addEventListener('keydown', (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        openLightbox(el.dataset.id);
      }
    });
  });
}

function incrementLikesOnEnterKey() {
  document.querySelectorAll('.media-photograph__icon').forEach((el) => {
    el.addEventListener('keydown', (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        incrementLikes(el.parentNode.parentNode.dataset.id);
      }
    });
  });
}
