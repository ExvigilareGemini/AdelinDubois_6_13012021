// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// EVENTS

// E01
// when page is scrolled, check the Y position, if 0 the .anchor is not visible, else it's visible
document.onscroll = function () {
  if (window.pageYOffset === 0) {
    document.querySelector('.anchor').style.opacity = '0';
  } else {
    document.querySelector('.anchor').style.opacity = '1';
  }
};

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// DYNAMIC MODIFICATION WITH TAGS CLICK IN HTML -> CALL F08 | F05-6-7 IS USED FOR F08

// F01
// select each tags with data-tagName=tagName (argument) and set data-isCheked to true or false
// depending from TrueOrFalse argument
// argument: tagName to search, TrueOrFalse is value for date-isChecked
// called in F04
function setDataCheckedAttributeOfTag(tagName, TrueOrFalse) {
  const tagDOMS = document.querySelectorAll(`[data-tagName="${tagName}"]`);
  tagDOMS.forEach((element) => element.setAttribute('data-isChecked', TrueOrFalse));
}

// F02
// compare two arrays, one contain all tags checked, the other contain list of li, if at least
// one data-tagname attribute of li correspond to a tag checked, return true, else return false
// arguments: actualTagsChecked[] & listOfArticlesLi[], arrays to compare from F03 (displayingArticles)
// called in F03 (displayingArticles)
function isTagCorrespondToTagsChecked(actualTagsChecked, arrayToCompare) {
  let TrueOrFalse = false;
  actualTagsChecked.forEach((element1) => arrayToCompare.forEach((element2) => {
    if (element1 === element2.getAttribute('data-tagname')) {
      TrueOrFalse = true;
    }
  }));
  return TrueOrFalse;
}

// F03
// get all articles .photograph, then get each li .tag of each articles and compared them to
// tags that are actually checked with F06. Display 'none' for articles that don't contains
// at least one tag checked
// argument: actualeTagsChecked[] from F04 (sortingByTag)
function displayingArticles(actualTagsChecked) {
  // 1 select all article .photograph
  const articlesAllDOM = document.querySelectorAll('.photograph');
  articlesAllDOM.forEach((article) => {
    // 2 for each, I select each li that it contain
    const listOfArticlesLi = article.querySelectorAll('.tag__link--smaller');
    // 3 making comparision + displaying
    if (actualTagsChecked.length === 0 || isTagCorrespondToTagsChecked(actualTagsChecked, listOfArticlesLi)) {
      article.style.display = 'flex';
    } else {
      article.style.display = 'none';
    }
  });
}

// F04
// when clicking on a tag, this chack if it is already checked, if not it add the tag name to
// actualTagsCheked[] and check the tag with data-isCheked. If it's actually checked, it remove
// the tagname form actualTagsCheked[] and uncheck the tag.
// Then it calls F03 (displayArticles) and pass him actualTagsChecked[]
// argument: tagName, name of the selected tag
// called in html, onclick with tag and in F07 (isRedirectFromPhotographerPage)
function sortingByTag(tagName) {
  const tagDOM = document.querySelector(`[data-tagName="${tagName}"]`);
  const actualTagsChecked = [];

  if (tagDOM.getAttribute('data-isChecked') === 'true') {
    const pos = actualTagsChecked.indexOf(tagName);
    actualTagsChecked.splice(pos, 1);
    setDataCheckedAttributeOfTag(tagName, 'false');
  } else {
    actualTagsChecked.push(tagName);
    setDataCheckedAttributeOfTag(tagName, 'true');
  }

  displayingArticles(actualTagsChecked);
}

// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// _________________________________________________________________________________________________
// DYNAMIC CREATION OF HTML BASED ON DATA.JSON. SEQUENCE OF EXECUTION : F09 -> F08 -> F06/F07 -> F05

// F05
// generate html content of 1 photographer displayed (.photograph) using template strings and
// populate with objectphotographer
// argument: object photographer from data.json
function photographHTMLGenerator(objectPhotographer) {
  return `
  <article id="${objectPhotographer.id}" class="photograph">
      <!-- IMAGE LINK -->
          <a href="./vue/photographer.html?id=${objectPhotographer.id}" class="photograph__link" role="link" aria-label="${objectPhotographer.name}">
            <img src="./assets/src/Sample_Photos/Photographers_ID_Photos/${objectPhotographer.portrait}" alt="${objectPhotographer.name}" class="photograph__image">
            <!-- NAME -->
            <h2 class="photograph__name">${objectPhotographer.name}</h2>
          </a>
      <!-- TEXT PARAGRAPH -->
      <p class="photograph__textparagraph">${objectPhotographer.city}, ${objectPhotographer.country}</p>
      <p class="photograph__textparagraph">${objectPhotographer.tagline}</p>
      <p class="photograph__textparagraph">${objectPhotographer.price}€/jour</p>
      <!-- TAGS -->
      <ul class="tag" aria-label="photographer categories">
      ${objectPhotographer.tags.map((tagPhotograph) => `
      <li><button type="button" tabindex="0" aria-label="tag ${tagPhotograph}" onclick="sortingByTag('${tagPhotograph}')" data-isChecked="" data-tagName="${tagPhotograph}" class="tag__link tag__link--smaller">#${tagPhotograph}</button></li>`).join('')
}
      </ul>
  </article>`;
}

// F06
// function that create all the block of HTML that is needed to be displayed,
// takes data and create a new array using .map and F05 (photographHTMLGenerator)
// argument: datas from JSON
function photographHTMLCompiler(data) {
  return data.map(photographHTMLGenerator).join('');
}

// F07
// check in url if index.html have been called by a tag in photographer page, if yes,
// get the tagname in url and sort the page with F04 (sortingByTag)
function isRedirectFromPhotographerPage() {
  const url = new URL(document.location.href);
  const isTagInUrl = url.searchParams.get('tagname');
  if (isTagInUrl !== null) {
    sortingByTag(isTagInUrl);
  }
}

// F08
// function inserting HTML create in F06 (photographHTMLCompiler),
// then call F07 (isRedirectFromPhotographerPage)
// argument: is datas form JSON passing to F09 (fetchDataToCreateIndexHTML)
function insertCreatedHTMLIndexHTML(data) {
  document.querySelector('.photograph-container').insertAdjacentHTML('afterbegin', photographHTMLCompiler(data.photographers));
  isRedirectFromPhotographerPage();
}

// F09
// function that get datas in the /src/data.json and chain with .then
// the response is tranform into json, then call F08
// called in index.html
function fetchDataToCreateIndexHTML() {
  fetch('./controller/src/data.json')
    .then((resp) => resp.json())
    .then((data) => insertCreatedHTMLIndexHTML(data))
    .catch((error) => console.log(`Erreur : ${error}`));
}
