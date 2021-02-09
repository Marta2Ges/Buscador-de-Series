"use strict";
//Recogemos los inputs en html
const input = document.querySelector(".js-input");
const results = document.querySelector(".js-list");
let search = [];

//Api

//function getSearchSeries() {
function getDataFromApi(event) {
  event.preventDefault();
  let searchValue = input.value;

  fetch(`http://api.tvmaze.com/search/shows?q=${searchValue}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.length > 0) {
        search = data;
      } else {
        search.innerHTML = "No hay resultados";
      }
    });
}
