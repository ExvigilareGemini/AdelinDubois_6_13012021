const dataToCreateElement = [
  // first level of child
  ['div', 'photograph__cadre', 1, '.photograph'],
  ['h2', 'photograph__name', 1, '.photograph'],
  ['p', 'photograph__textparagraph', 3, '.photograph'],
  ['div', 'tag', 1, '.photograph'],
  // second level of child
  ['a', 'photograph__link', 1, '.photograph__cadre'],
  ['img', 'photograph__image', 1, '.photograph__cadre'],
  ['a', 'tag__link tag__link--smaller', 4, '.tag'],
];

// FUNCTIONS
function articleCreator(idArticle) {
  const articleCreated = document.createElement('article');
  articleCreated.setAttribute('id', idArticle);
  articleCreated.setAttribute('class', 'photograph');
  return articleCreated;
}

function firstChildCreator(typeOfElement, classNameOfElement) {
  const elementCreated = document.createElement(typeOfElement);
  elementCreated.setAttribute('class', classNameOfElement);
  return elementCreated;
}

function secondChildCreator(typeOfElement, classNameOfElement) {
  const elementCreated = document.createElement(typeOfElement);
  elementCreated.setAttribute('class', classNameOfElement);
  return elementCreated;
}

function photographCreator(numberOfPhotograph) {
  for (let p = 0; p < numberOfPhotograph; p++) {
    // ___________________________________________________________________________________________
    // ARTICLE CREATION
    // selection du main
    const main = document.querySelector('.main');
    // creation article avec id et class
    main.appendChild(articleCreator(p));

    // ___________________________________________________________________________________________
    // FIRST LEVEL OF CHILD
    // je sélectionne mon article créé
    const article = document.getElementById(p);
    // création du premier niveau des enfants (ici div, h2, p, div)
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < dataToCreateElement[i][2]; j++) {
        article.appendChild(firstChildCreator(dataToCreateElement[i][0], dataToCreateElement[i][1]));
      }
    }

    // ___________________________________________________________________________________________
    // SECOND LEVEL OF CHILD
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < dataToCreateElement[i + 4][2]; j++) {
        // je sélectionne l'element avec la classe tag dans l'article avec id 0
        const parentElement = article.querySelector(dataToCreateElement[i + 4][3]);
        // creation des seconds enfants
        parentElement.appendChild(secondChildCreator(dataToCreateElement[i + 4][0], dataToCreateElement[i + 4][1]));
      }
    }
    // ___________________________________________________________________________________________
  }
}

photographCreator(4);

// template string
// meilleure maintenance que createlement
const colors = ['blue', 'red', 'green'];

const reducer = (accumulator, currentValue) => accumulator + currentValue;

function generateItem(color) {
  return `<div class="item" style="background-color: ${color}"></div>`;
}

function generateItems(colors) {
  return colors.map(generateItem).reduce(reducer);
}

document.querySelector('#container').innerHTML = generateItems(colors);
