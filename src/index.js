'use strict';

import { movieApi } from './movieApi';
import { Pagination } from './Pagination';
import Notiflix from 'notiflix';

const refs = {
  filmotekaList: document.querySelector('.filmoteka-list'),
  paginationList: document.querySelector('.pagination-list'),
  search: document.querySelector('.search-form'),
  spinner: document.querySelector('.spinner'),
  backdrop: document.querySelector('.backdrop'),
  closeBtn: document.querySelector('.modal__close-btn'),
  modal: document.querySelector('.modal-movie'),
  modalContent: document.querySelector('.modal-content'),
  spinnerBackdrop: document.querySelector('.spinner-backdrop'),
};

refs.paginationList.addEventListener('click', handlePagination);
refs.search.addEventListener('submit', search);
refs.filmotekaList.addEventListener('click', openModal);
refs.closeBtn.addEventListener('click', toggleModal);
refs.modal.addEventListener('click', handleModalEvent);

const postersPath = 'https://image.tmdb.org/t/p/w500';

const watched = window.localStorage.getItem('watched')
  ? JSON.parse(window.localStorage.getItem('watched'))
  : [];

const queue = window.localStorage.getItem('queue')
  ? JSON.parse(window.localStorage.getItem('queue'))
  : [];

let currentMovie;
let genres = null;
let movies = null;
//const apiKey = 'bf849ac9154ddcf14074361fb0f94011';

const dataApi = new movieApi();
const pagination = new Pagination();

const loadData = async () => {
  try {
    refs.spinnerBackdrop.classList.remove('is-hidden');
    movies = await dataApi.getData();
    console.log('movies', movies);
    if (!genres) {
      genres = await dataApi.loadGenre();
    }
    
    refs.filmotekaList.innerHTML = createMarkup(movies.data.results);
    refs.paginationList.innerHTML = pagination.creatPagination(
      dataApi.getPage(), 10, 400);
    refs.spinnerBackdrop.classList.add('is-hidden');
  } catch (error) {
    console.error(error);
  }
};

const createGenreStr = genre_ids => {
  return genre_ids
    .map(item => genres.find(option => option.id == item).name)
    .join(', ');
};

function handlePagination(event) {
  event.preventDefault();
  if (event.target.classList.contains('pagination-link')) {
    if (event.target.classList.contains('page-right')) {
      dataApi.incrementPage();
    } else if (event.target.classList.contains('page-left')) {
      dataApi.decrementPage();
    } else {
      console.dir(event.target.innerText);
      dataApi.setPage(Number(event.target.innerText));
    }
    loadData();
  }
}

function search(event) {
  event.preventDefault();
  let query = event.currentTarget.elements.search.value;
  dataApi.setQuery(query);
  //let page = 1;
  //activePage = 1;
  loadData();
}

function toggleModal() {
  refs.backdrop.classList.toggle('is-hidden');
}

function openModal(event) {
  const currentId = event.target.closest('li').dataset.id;
  currentMovie = movies.data.results.find(({ id }) => id === Number(currentId));
  console.log(currentMovie);
  refs.modalContent.innerHTML = createModalContent(currentMovie);
  toggleModal();
}

function handleModalEvent(event) {
  console.log(event.target.classList);
  if (event.target.classList.contains('watched')) {
    watched.push(currentMovie);
    window.localStorage.setItem('watched', JSON.stringify(watched));
    Notiflix.Notify.success('The movie added to the library!');
    toggleModal();
  }
  if (event.target.classList.contains('queue')) {
    queue.push(currentMovie);
    window.localStorage.setItem('queue', JSON.stringify(queue));
    Notiflix.Notify.success('The movie added to the library!');
    toggleModal();
  }

   
}

function createModalContent(currentMovie) {
  const {
    id,
    title,
    original_title,
    vote_average,
    vote_count,
    popularity,
    overview,
    poster_path,
    genre_ids,
  } = currentMovie;

  return `<div class="modal-img-wrapper">
              <img src="${postersPath}${poster_path}" alt="">
          </div>

          <div class="modal__discription-wrapper">
            <h3 class="modal__title">${title}</h3>
            <ul class="modal__discription-list list">
              <li class="modal__discription-item">
                <span class="modal__discription-title">Vote / Votes</span>
                <span class="modal-value active">${vote_average.toFixed(
                  1
                )}</span> / 
                <span class="modal-value">${vote_count}</span>
              </li>
              <li class="modal__discription-item">
                <span class="modal__discription-title">Popularity</span>
                <span class="modal-value">${popularity.toFixed(1)}</span>
              </li>
              <li class="modal__discription-item">
                <span class="modal__discription-title">Original Title</span>
                <span class="modal-value">${original_title}</span>
              </li>
              <li class="modal__discription-item">
                <span class="modal__discription-title">Genre</span>
                <span class="modal-value">${createGenreStr(genre_ids)}</span>
              </li>
            </ul>

            <h4 class="modal-about">About</h4>
            <p class="modal-about-text">${overview}</p>
            <div class="modal-btn-wrapper">
              <button class="modal-btn watched">add to Watched</button>
              <button class="modal-btn queue">add to queue</button>
            </div>
          </div>`;
}

const createMarkup = data => {
  return data
    .map(
      item =>
        `<li class="filmoteka-item" data-id="${item.id}">
          <div>
            <a href=">
              <div class="filmoteka-thumb">
                  <img class="filmoteka-img" src="${postersPath}${
          item.poster_path
        }" alt="${item.overview}" />
              </div>
            </a>
            <h2 class="filmoteka-title">${item.title.toUpperCase()}</h2>
            <p class="filmoteka-discription">${createGenreStr(
              item.genre_ids
            )} | ${new Date(item.release_date).getFullYear()}</p>
          </div>
        </li>`
    )
    .join('');
};

loadData();
