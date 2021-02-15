// VARIABLES
let actualPhotographerId = 0;
let actualPhotographerName = '';
const tabindexval = 4;

// ARRAY
const arrayOfMedias = [];

// DOM
const mainHTML = document.querySelector('.main');
const headerHTML = document.querySelector('.header');
const sortingMediaSelect = document.querySelector('.sorting-media__select');

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// LIKE BUTTON FUNCTION

// F10
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
// ACCESSIBILITY FUNCTION AND EVENT

// F11
// when focus on media img/video of .media-photograph and press enter -> call F16 displaying lightbox
function openLightboxOnEnterKey() {
  document.querySelectorAll('.media-photograph__media').forEach((el) => {
    el.addEventListener('keydown', (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        openLightbox(el.dataset.id);
      }
    });
  });
}

// F12
// when focus on heart icon of .media-photograph and press enter -> call F10 changing number of like
function incrementLikesOnEnterKey() {
  document.querySelectorAll('.media-photograph__icon').forEach((el) => {
    el.addEventListener('keydown', (event) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        incrementLikes(el.parentNode.parentNode.dataset.id);
      }
    });
  });
}

// F13
// modify ariaHidden attribute of .main&.header and an element with .className = className(argument)
// argument: first is the value to set to .main&.header, modalAriaHidden is the value to set to
//           the element, className is the name of the element
function ariaHiddenModification(mainHeaderAriaHidden, modalAriaHidden, className) {
  mainHTML.setAttribute('aria-hidden', mainHeaderAriaHidden);
  headerHTML.setAttribute('aria-hidden', mainHeaderAriaHidden);
  document.querySelector(className).setAttribute('aria-hidden', modalAriaHidden);
}

// E02
// listen keydown, if it's escape and modal or lightbox is open -> close it F15 or F19
// if it's left or right arrow and lightbox is open, display adjacent media F13
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
        showAdjacentMediaLightbox(-1);
      }
      break;
    case 'ArrowRight':
      if (lightboxAriaHidden === 'false') {
        showAdjacentMediaLightbox(1);
      }
      break;
    default:
  }
});
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// LIGHTBOX FUNCTIONS AND EVENTS

// F14
// check the type of media to be displayed and hide/show corresponding html element
// check the type, if img, make <img> visible and modify it's attribute src & alt, <video> is hiding
// if the type is video, same as above but inversing img & video
// argument: type (img/video), src (where to find media), description (set alt or aria-label)
// called in F15
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
// display the media in the lightbox
// first select lightbox and every information needed for the displaying, based on the argument
// then change the description and date-attribute data-id of the lightbox, then call F14 and pass
// type, src and description from arrayOfMedia[] (set in F25)
// argument: is the id of media that need to be displayed
// called in F16 & F18
function displayMediaInLightbox(idOfMedia) {
  const lightbox = document.querySelector('.lightbox');
  const positionInArray = arrayOfMedias.findIndex((media) => media.id == idOfMedia);
  const srcOfMedia = arrayOfMedias[positionInArray].src;
  const typeOfMedia = arrayOfMedias[positionInArray].type;
  const descriptionOfMedia = arrayOfMedias[positionInArray].description;

  lightbox.querySelector('.lightbox__description').textContent = descriptionOfMedia;

  lightbox.setAttribute('data-id', idOfMedia);

  lightboxmediaTagFactory(typeOfMedia, srcOfMedia, descriptionOfMedia);
}

// F16
// change the media displayed in the lightbox
// first it get id of the actual displayed media stored in data-id of lightbox (set in F15)
// then get the position(index) of this id in arrayOfMedias[],then modify position with the argument
// then display the new media with F15 and the newid which is set using the new position
// argument: int, 1 or -1 to display the media before or after
// called in E02 and onclick .lightbox__previous/next which are button to navigate in lightbox
function showAdjacentMediaLightbox(mouvement) {
  const lightboxId = document.querySelector('.lightbox').getAttribute('data-id');
  let position = arrayOfMedias.findIndex((media) => media.id == lightboxId);
  console.log("ok");
  position += mouvement;
  if (position < 0) {
    position = arrayOfMedias.length - 1;
  } else if (position > arrayOfMedias.length - 1) {
    position = 0;
  }
  const newId = arrayOfMedias[position].id;
  displayMediaInLightbox(newId);
}

// F17
// call F13 modifying aria-hidden, then close the lightbox
function closeLightbox() {
  ariaHiddenModification('false', 'true', '.lightbox');
  document.querySelector('.lightbox').style.display = 'none';
  document.querySelector(`.media-photograph__media[data-id="${document.querySelector('.lightbox').dataset.id}"]`).focus();
}

// F18
// call F13 modify aria-hidden, then open lightbox, then call F15 to display the media in lightbox
// argument: id of media to display qith F15
// called while clicking on .media-photographer__media and in F11
function openLightbox(idOfMedia) {
  ariaHiddenModification('true', 'false', '.lightbox');
  document.querySelector('.lightbox').style.display = 'grid';
  document.querySelector('.lightbox__cross').focus();
  displayMediaInLightbox(idOfMedia);
}

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// MODAL FUNCTIONS AND EVENT

// F19
// modify background when modal is open, it modify background opacity and clickbility of them
// argument: opcityVaue is modifidcation value of opacity, pointerEventValue, clickability on/off
// called in F20-21
function modalBackgroundDesactivated(opacityValue, pointerEventValue) {
  mainHTML.style.opacity = opacityValue;
  mainHTML.style.pointerEvents = pointerEventValue;
  headerHTML.style.opacity = opacityValue;
  headerHTML.style.pointerEvents = pointerEventValue;
}

// F20
// call F19 for background & F13 for aria-hidden, then put the name of photographer in the title
// then display the modal
// called by click on .description-photographer__button button
function openModal() {
  modalBackgroundDesactivated('0.5', 'none');
  ariaHiddenModification('true', 'false', '.modal');
  document.querySelector('.contact-modal__title').textContent = `Contactez moi ${actualPhotographerName}`;
  document.querySelector('.contact-modal').style.display = 'flex';
  document.querySelector('.contact-modal__cross').focus();
}

// F21
// call F19 for background & F13 for aria-hidden, then closingModal
// called by click on contact-modal__cross
function closeModal() {
  modalBackgroundDesactivated('1', 'auto');
  ariaHiddenModification('false', 'true', '.modal');
  document.querySelector('.contact-modal').style.display = 'none';
  document.querySelector('.description-photographer__button').focus();
}

// E03
// On submitting contact-modal, prevent it and display inputs values in log
document.querySelector('.contact-modal').addEventListener('submit', (e) => {
  e.preventDefault();
  const values = document.querySelectorAll('.contact-modal__input');
  values.forEach((el) => console.log(el.value));
});

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// SORTING USING SELECT INPUT TO DISPLAY MEDIAS SORTED BY POPULARITY, DATE OR DESCRIPTION

// F22
// function that sort arrayOfMedia[] according to propertyName (argument) and use it to display
// each media in the new order using order css property.
// for accessibility, each media get a tabindex to create a coherent tab navigation
// !!!!!!! if adding new element before medias in photographer.html that need to be focusable
// with tab navigation, this element must have tabindex following the number in the html: 4,5,...
// and the variable tabindexval must be increase by the number of new element !!!!!!!
// argument: propetyName is the selected choice for the sorting (popularity, date or description)
function sortAndDisplay(propertyName) {
  let orderPosition = 0;

  arrayOfMedias.sort((a, b) => ((a[propertyName] > b[propertyName]) ? 1 : -1));
  arrayOfMedias.forEach((el) => {
    const mediaSortAndDisplay = document.querySelector(`[data-id='${el.id}']`);
    mediaSortAndDisplay.style.order = orderPosition;
    orderPosition += 1;

    mediaSortAndDisplay.querySelector('.media-photograph__media').setAttribute('tabindex', orderPosition + tabindexval);
    mediaSortAndDisplay.querySelector('.media-photograph__icon').setAttribute('tabindex', orderPosition + tabindexval);
  });
}

// F23
// checking the value of <select> element and send it to F22
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

// E04
// when value of the <select> change -> call F23
sortingMediaSelect.addEventListener('change', () => sortingMedias());

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// DYNAMIC CREATION OF THE PAGE. POPULATE PHOTOGRAPHER & CREATA HTML FOR MEDIAS
//  SEQUENCE OF EXECUTION :

// F24
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
        <button tabindex="2" class="description-photographer__button button" onclick="openModal()" type="button" aria-label="Contact me">Contactez-moi</button>
        <div class="description-photographer__cadre">
          <img src="../assets/src/Sample_Photos/Photographers_ID_Photos/${actualPhotographer.portrait}" alt="${actualPhotographer.name}" class="description-photographer__image">
        </div>
        <nav class="tag tag--left" aria-label="photographer categories">
        ${actualPhotographer.tags.map((tagPhotograph) => `
        <a tabindex="3" href="../index.html?tagname=${tagPhotograph}" aria-label="tag ${tagPhotograph}" class="tag__link tag__link--smaller">#${tagPhotograph}</a>`).join('')
}
        </nav>
        `;
}

// F25
// return media <img> if media is an image, <video> if it's a video
// also populate array
function mediaTagFactory(mediaToTest) {
  if ('image' in mediaToTest) {
    arrayOfMedias.push({
      id: mediaToTest.id,
      likes: mediaToTest.likes,
      description: mediaToTest.description,
      date: mediaToTest.date,
      src: `../assets/src/Sample_Photos/${actualPhotographerName}/${mediaToTest.image}`,
      type: 'img',
    });
    return `<img tabindex="0" src="../assets/src/Sample_Photos/${actualPhotographerName}/${mediaToTest.image}" alt="${mediaToTest.description}, closeup view" class="media-photograph__media" onclick="openLightbox(${mediaToTest.id})" data-id="${mediaToTest.id}">`;
  }
  arrayOfMedias.push({
    id: mediaToTest.id,
    likes: mediaToTest.likes,
    description: mediaToTest.description,
    date: mediaToTest.date,
    src: `../assets/src/Sample_Photos/${actualPhotographerName}/${mediaToTest.video}`,
    type: 'video',
  });
  return `<video tabindex="0" src="../assets/src/Sample_Photos/${actualPhotographerName}/${mediaToTest.video}" aria-label="${mediaToTest.description}, closeup view" class="media-photograph__media" onclick="openLightbox(${mediaToTest.id})" data-id="${mediaToTest.id}"></video>`;
}

// F26
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
        <img src="../assets/src/heart-icon.svg" tabindex="0" class="media-photograph__icon" alt="likes" onclick="incrementLikes(${media.id})"></img>
    </div>
  </article>
        `;
  }

  return '';
}

// F27
// function that create all the block of HTML that is needed to be displayed,
// takes data and create a new array using .map and F05 (photographHTMLGenerator)
// argument: datas from JSON
function mediaPhotographHtmlCompiler(mediaJSON) {
  return mediaJSON.map(createHtmlMediaPhotograph).join('');
}

// F28
// sum all the likes then display it in the .showing-box
function displayTotalNumberOfLikes() {
  const totalNumberOfLikes = arrayOfMedias.reduce((a, b) => ({ likes: a.likes + b.likes }));
  document.querySelector('.showing-box__numberOfLike').textContent = totalNumberOfLikes.likes;
}

// F29
// set the name of photographer as title of photographer.html (.title)
function displayTitleOfPage() {
  document.querySelector('.title').textContent = actualPhotographerName;
}

// F30
// get id of the photographer in url (see app.js > F05 > .photograph__link > href), then search
// corresponding photographer datas in data argument with the id. Set the name of photographer in
// actualPhotographerName variable used for F18, F25 & F29
// then insert created HTML from F27 and F24 in photographer.html
// then call F28-29 to display values stored in data.json
// then call F22-23 to initiate listening of events
// argument: datas form the data.json
// called in F31
function insertCreatedHTMLAndValuesPhotographerHTML(data) {
  const url = new URL(document.location.href);
  actualPhotographerId = url.searchParams.get('id');

  const actualPhotographerDatas = data.photographers.find((el) => el.id == actualPhotographerId);

  actualPhotographerName = actualPhotographerDatas.name;

  document.querySelector('.description-photographer').insertAdjacentHTML('afterbegin', createHtmlDescriptionPhotographer(actualPhotographerDatas));
  document.querySelector('.media-photographer-container').insertAdjacentHTML('afterbegin', mediaPhotographHtmlCompiler(data.media));

  displayTotalNumberOfLikes();
  displayTitleOfPage();

  openLightboxOnEnterKey();
  incrementLikesOnEnterKey();
}

// F31
// function that get datas in the /src/data.json and chain with .then
// the respons is tranform into json, then the datas received are passed to F31
// called in photographer.html
function fetchDataToCreatePhotographerPageHTML() {
  fetch('../controller/src/data.json')
    .then((resp) => resp.json())
    .then((data) => insertCreatedHTMLAndValuesPhotographerHTML(data))
    .catch((error) => console.log(`Erreur : ${error}`));
}
