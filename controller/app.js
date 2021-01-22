const actualTagsChecked = [];

// Dynamic creation of HTML based on JSON datas. Sequence of execution : A04 -> A03 -> A02 -> A01

function isTagCorrespondToTagChecked(arrayToCheck) {
  let TrueOrFalse = false;
  actualTagsChecked.forEach((element1) => arrayToCheck.forEach((element2) => {
    if (element1 === element2) {
      TrueOrFalse = true;
    }
  }));
  return TrueOrFalse;
}

// A01
// function using template string to generate HTML, creating the photograph part of the home page
// the argument is an object coming from the json taht include photographers datas
// object.data is used to insert photographers information in the created HTML
// before the <li... looping creation of tags, permit to adapt the numbers of each by photographers
function photographHTMLGenerator(objectPhotograph) {
  if (actualTagsChecked.length === 0 || isTagCorrespondToTagChecked(objectPhotograph.tags)) {
    console.log('3');
    return `
  <article id="${objectPhotograph.id}" class="photograph">
      <!-- IMAGE LINK -->
      <div class="photograph__cadre">
          <a href="#" class="photograph__link"></a>
          <img src="./assets/src/Sample_Photos/Photographers_ID_Photos/${objectPhotograph.portrait}" alt="" class="photograph__image">
      </div>
      <!-- NAME -->
      <h2 class="photograph__name">${objectPhotograph.name}</h2>
      <!-- TEXT PARAGRAPH -->
      <p class="photograph__textparagraph">${objectPhotograph.city}, ${objectPhotograph.country}</p>
      <p class="photograph__textparagraph">${objectPhotograph.tagline}</p>
      <p class="photograph__textparagraph">${objectPhotograph.price}€/jour</p>
      <!-- TAGS -->
      <ul class="tag" aria-label="photographer categories">
      ${objectPhotograph.tags.map((tagPhotograph) => `
      <li onclick="sortingByTag('${tagPhotograph}')" data-isChecked="" data-tagName="${tagPhotograph}" class="tag__link tag__link--smaller">#${tagPhotograph}</li>`).join('')
}
      </ul>
  </article>`;
  }
  return '';
}

// A02
// function that create all the block of HTML that is needed to be displayed
// argument is an array, it comes from the JSON and contains photographers datas (see A03)
// taking array of JSON, trasnform it in a new array by applying the A01 function to each (.map)
function photographHTMLCompiler(arrayOfJson) {
  return arrayOfJson.map(photographHTMLGenerator).join('');
}

// A03
// function applying A02 to the photographer's container
// argument is the array coming from JSON passing to A02
function photographCreator(data) {
  document.querySelector('.photograph-container').innerHTML = photographHTMLCompiler(data.photographers);
}

// A04
// function that get datas in the /src/data.json and chain with .then
// the respons is tranform into json, then the datas received are passed to A03
function fetchDataToCreatePhotographersHTML() {
  fetch('./controller/src/data.json')
    .then((resp) => resp.json())
    .then(console.log('2'))
    .then((data) => photographCreator(data))
    .then(console.log('4'))
    .catch((error) => console.log(`Erreur : ${error}`));
}

// calling A04 on loading page
fetchDataToCreatePhotographersHTML();

async function sortingByTag(tagName) {
  const tagDOM = document.querySelector(`[data-tagName="${tagName}"]`);

  if (tagDOM.getAttribute('data-isChecked') === 'true') {
    const pos = actualTagsChecked.indexOf(tagName);
    actualTagsChecked.splice(pos, 1);
    fetchDataToCreatePhotographersHTML();
    const tagDOMS = document.querySelectorAll(`[data-tagName="${tagName}"]`);
    tagDOMS.forEach((element) => element.setAttribute('data-isChecked', 'false'));
    // tagDOM.setAttribute('data-isChecked', 'false');
  } else {
    actualTagsChecked.push(tagName);
    (console.log('1'));
    fetchDataToCreatePhotographersHTML();
    (console.log('5'));
    const tagDOMS = document.querySelectorAll(`[data-tagName="${tagName}"]`);
    (console.log('6'));
    tagDOMS.forEach((element) => element.setAttribute('data-isChecked', 'true'));
  }
}
