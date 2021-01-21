// Dynamic creation of HTML based on JSON datas. Sequence of execution : A04 -> A03 -> A02 -> A01

// A01
// function using template string to generate HTML, creating the photograph part of the home page
// the argument is an object coming from the json taht include photographers datas
// object.data is used to insert photographers information in the created HTML
// at line 24, looping creation of tags, permit to adapt the numbers of each by photographers
function photographHTMLGenerator(objectPhotograph) {
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
      <p class="photograph__textparagraph">${objectPhotograph.price}/jour</p>
      <!-- TAGS -->
      <div class="tag" aria-label="photographer categories">
      ${objectPhotograph.tags.map((tagPhotograph) => `
      <a href="#" class="tag__link tag__link--smaller">#${tagPhotograph}</a>`).join('')
}
      </div>
  </article>`;
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
    .then((data) => photographCreator(data))
    .catch(console.log('FETCH : ERROR'));
}

// calling A04 on loading page
fetchDataToCreatePhotographersHTML();
