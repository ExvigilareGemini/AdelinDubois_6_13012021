const actualTagsChecked = [];

window.onscroll = function () {
  if (window.pageYOffset === 0) {
    document.querySelector('.anchor').style.opacity = '0';
  } else {
    document.querySelector('.anchor').style.opacity = '1';
  }
};

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// DYNAMIC CREATION OF HTML BASED ON JSON DATAS. SEQUENCE OF EXECUTION : F04 -> F03 -> F02 -> F01

// F01
// function using template string to generate HTML, creating the photograph part of the home page
// the argument is an object coming from the json taht include photographers datas
// object.data is used to insert photographers information in the created HTML
// before the <li... looping creation of tags, permit to adapt the numbers of each by photographers
function photographHTMLGenerator(objectPhotograph) {
  return `
  <article id="${objectPhotograph.id}" class="photograph">
      <!-- IMAGE LINK -->
      <div class="photograph__cadre">
          <a href="./vue/photographer.html?id=${objectPhotograph.id}" class="photograph__link"></a>
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

// F02
// function that create all the block of HTML that is needed to be displayed
// argument is an array, it comes from the JSON and contains photographers datas (see F03)
// taking array of JSON, trasnform it in a new array by applying the F01 function to each (.map)
function photographHTMLCompiler(arrayOfJson) {
  return arrayOfJson.map(photographHTMLGenerator).join('');
}

// F03
// function applying F02 to the photographer's container
// argument is the array coming from JSON passing to F02
function photographCreator(data) {
  document.querySelector('.photograph-container').insertAdjacentHTML('afterbegin',photographHTMLCompiler(data.photographers));
}

// F04
// function that get datas in the /src/data.json and chain with .then
// the respons is tranform into json, then the datas received are passed to F03
function fetchDataToCreatePhotographersHTML() {
  fetch('./controller/src/data.json')
    .then((resp) => resp.json())
    .then((data) => photographCreator(data))
    .catch((error) => console.log(`Erreur : ${error}`));
}

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// DYNAMIC MODIFICATION WITH TAGS CLICK IN HTML -> CALL F08 | F05-6-7 IS USED FOR F08

// F05
// function modifying data-attribute isChecked to tags in all the dom, making him
// visually checked. Argument tagname is the data-attribute tagname of the tag
// TrueOrFalse is a string -> 'true' the tag is checked, 'false is unchecked
function setDataCheckedAttributeOfTag(tagName, TrueOrFalse) {
  const tagDOMS = document.querySelectorAll(`[data-tagName="${tagName}"]`);
  tagDOMS.forEach((element) => element.setAttribute('data-isChecked', TrueOrFalse));
}

// F06
// compare two arrays, one contain all tags checked, the other contain list of li if at least
// one data-tagname attribute of li correspond to a tag checked, return true, else return false
function isTagCorrespondToTagsChecked(arrayToCompare) {
  let TrueOrFalse = false;
  actualTagsChecked.forEach((element1) => arrayToCompare.forEach((element2) => {
    if (element1 === element2.getAttribute('data-tagname')) {
      TrueOrFalse = true;
    }
  }));
  return TrueOrFalse;
}

// F07
// get all articles .photograph, then get each li .tag of each articles and compared them to
// tags that are actually checked with F06. Display 'none' for articles that don't contains
// at least one tag checked
function displayingArticles() {
  // 1 select all article .photograph
  const articlesAllDOM = document.querySelectorAll('.photograph');
  articlesAllDOM.forEach((article) => {
    // 2 for each, I select each li that it contain
    const lisOfArticle = article.querySelectorAll('.tag__link--smaller');
    // 3 making comparision + displaying
    if (actualTagsChecked.length === 0 || isTagCorrespondToTagsChecked(lisOfArticle)) {
      article.style.display = 'flex';
    } else {
      article.style.display = 'none';
    }
  });
}

// F08
// receiving the calling from onclick in HTML li .tags, argument is the tagname of the li
// then check if tag is already checked, it add/delete the tagname to actualTagsChecked[] used
// in F06&F07, then call F05 to change checked status in HTML. Finally call F07 to display articles
function sortingByTag(tagName) {
  const tagDOM = document.querySelector(`[data-tagName="${tagName}"]`);
  if (tagDOM.getAttribute('data-isChecked') === 'true') {
    const pos = actualTagsChecked.indexOf(tagName);
    actualTagsChecked.splice(pos, 1);
    setDataCheckedAttributeOfTag(tagName, 'false');
  } else {
    actualTagsChecked.push(tagName);
    setDataCheckedAttributeOfTag(tagName, 'true');
  }

  displayingArticles();
}
