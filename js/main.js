"use strict";
//Recogemos los inputs en html
const inputElement = document.querySelector(".js-input");
const resultsElements = document.querySelector(".js-list");
const buttonElement = document.querySelector(".js-btn");
const formElement = document.querySelector(".js-form");
const favoritesListElement = document.querySelector(".js-favorite-list");

let search = [];
let favorites = [];

//Api

function getDataFromApi() {
  const searchValue = inputElement.value;
  fetch(`https://api.tvmaze.com/search/shows?q=${searchValue}`)
    .then((response) => response.json())
    .then((data) => {
      search = data;

      paintSeries(search);
    });
}
//Escuchamos al botón para que al clickarlo, llame a la función que coge los datos del Api

//PREVENT
function handleForm(ev) {
  ev.preventDefault();
  getDataFromApi();
}
formElement.addEventListener("submit", handleForm);

//pintar datos iterando el array
function paintSeries(series) {
  let htmlCode = "";
  const DefaultImage = "https://via.placeholder.com/210x295/ffffff/666666/?";

  for (const eachItem of series) {
    let favSerie;
    if (isFavSeries(eachItem.show.id)) {
      favSerie = "favorite";
    } else {
      favSerie = "";
    }
    htmlCode += `<li class='js-series ${favSerie}'id="${eachItem.show.id}">`;
    htmlCode += `<h2 class='js-seriesTitle''>${eachItem.show.name}</h2>`;
    const seriesImg = eachItem.show.image;

    if (seriesImg === null) {
      htmlCode += `<img class="sectionSeries__list--img" src="${DefaultImage}">`;
    } else {
      htmlCode += `<img class="sectionSeries__list--img" src=${seriesImg.medium}>`;
    }
    htmlCode += "</li>";
  }

  resultsElements.innerHTML = htmlCode;
  listenSeries();
}

//Series Fav

function isFavSeries(id) {
  const foundSerieIndex = favorites.findIndex((serie) => serie.show.id === id);
  if (foundSerieIndex !== -1) {
    return true;
  } else {
    return false;
  }
}

//ESCUCHAR EV FAVORITAS

function listenSeries() {
  const FavElements = document.querySelectorAll(".js-series");

  for (const FavElement of FavElements) {
    FavElement.addEventListener("click", handleMovie);
  }
}

function handleMovie(ev) {
  const clickedSeriesId = parseInt(ev.currentTarget.id);
  const foundSerieIndex = favorites.findIndex(
    (serie) => serie.show.id === clickedSeriesId
  );
  if (foundSerieIndex === -1) {
    const foundSerie = search.find(
      (serie) => serie.show.id === clickedSeriesId
    );
    favorites.push(foundSerie);
  } else {
    favorites.splice(foundSerieIndex, 1);
  }

  console.log(favorites);
  setInLocalStorage(favorites);
  paintSeries(search);
  paintFavorites(favorites);
}

//setInLocalStorage();
//}
//PINTAR FAVORITAS EN SU LISTA
function paintFavorites(series) {
  let htmlCode = "";
  const defaultImage = "https://via.placeholder.com/210x295/ffffff/666666/?";

  for (const eachItem of series) {
    htmlCode += `<li class='js-fav'id="${eachItem.show.id}">`;
    htmlCode += `<h2 class='js-favTitle''>${eachItem.show.name}</h2>`;
    const seriesImg = eachItem.show.image;

    if (seriesImg === null) {
      htmlCode += `<img class="sectionFav__list--img" src="${defaultImage}">`;
    } else {
      htmlCode += `<img class="sectionFav__list--img" src=${seriesImg.medium}>`;
    }
    htmlCode += "</li>";
    htmlCode += '<button class="js-remove">X</button>';
  }
  favoritesListElement.innerHTML = htmlCode;
}

// LS
function setInLocalStorage() {
  const stringfav = JSON.stringify(favorites);
  localStorage.setItem("favorites", stringfav);
}

// get information of favourite series from my local storage
function getFromLocalStorage() {
  const localStorageFav = localStorage.getItem("favorites");
  if (localStorageFav !== null) {
    const arraySeries = JSON.parse(localStorageFav);
    favorites = arraySeries;
  }
}
getFromLocalStorage();
paintFavorites(favorites);
