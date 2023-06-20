import axios from 'axios';

const refs = {
  filmotekaList: document.querySelector('.filmoteka-list'),
  paginationList: document.querySelector('.pagination-list'),
  pagination: document.querySelector('.pagination'),
  search: document.querySelector('.search-form'),
  spinner: document.querySelector('.spinner'),
  backdrop: document.querySelector('.backdrop'),
  closeBtn: document.querySelector('.modal__close-btn'),
  modal: document.querySelector('.modal-movie'),
  modalContent: document.querySelector('.modal-content'),
};

refs.pagination.addEventListener('click', pagination);
refs.search.addEventListener('submit', search);
refs.filmotekaList.addEventListener('click', openModal);
refs.closeBtn.addEventListener('click', toggleModal);
refs.modal.addEventListener('click', handleModalEvent);

const apiKey = 'bf849ac9154ddcf14074361fb0f94011';
const postersPath = 'https://image.tmdb.org/t/p/w500';
const BaseURL = 'https://api.themoviedb.org/3';
const watched = [];
const queue = [];

let totalPages = 500;
let pageItems = 5;
let page = 1;
let activePage = 1;
let startPage = page;
let endPage =
  page + (pageItems - 1) < totalPages ? page + (pageItems - 1) : totalPages;
let query = '';
let movies;
let currentMovie;
let genres;

let url = `${BaseURL}/trending/movie/day?api_key=${apiKey}&page=${page}`;

const loadData = async () => {
  url =
    query != ''
      ? `${BaseURL}/search/movie?api_key=${apiKey}&query=${query}&page=${page}`
      : `${BaseURL}/trending/movie/day?api_key=${apiKey}&page=${page}`;
  const result = await axios.get(url);
  console.dir(result);
  return result.data;
};

const loadGenre = async () => {
  const url = `${BaseURL}/genre/movie/list?language=en&api_key=${apiKey}`;
  const result = await axios.get(url);
  return result.data.genres;
};

const createGenreStr = (genres, genre_ids) => {
  return genre_ids
    .map(item => genres.find(option => option.id == item).name)
    .join(', ');
};

function search(event) {
  event.preventDefault();
  query = event.currentTarget.elements.search.value;
  page = 1;
  activePage = 1;
  loadMovies();
}

function toggleModal() {
  refs.backdrop.classList.toggle('is-hidden');
}

function openModal(event) {
  const currentId = event.target.closest('li').dataset.id;
  currentMovie = movies.results.find(
    ({ id }) => id === Number(currentId)
  );
  console.log(currentMovie);
  refs.modalContent.innerHTML = createModalContent(currentMovie);
  toggleModal();
}

function handleModalEvent(event) {
  console.log(event.target.classList);
  if (event.target.classList.contains('watched')) {
    watched.push(currentMovie);
    console.log('watched', watched);
  }
  if (event.target.classList.contains('queue')) {
    queue.push(currentMovie);
    console.log('queue', queue);
  }
}

function createModalContent(currentMovie) {
  const {
    title,
    original_title,
    vote_average,
    vote_count,
    popularity,
    overview,
    poster_path,
    genre_ids
  } = currentMovie;

  return `<div class="modal-img-wrapper">
            <img src="${postersPath}${poster_path}" alt="">
          </div>

          <div class="modal__discription-wrapper">
            <h3 class="modal__title">${title}</h3>
            <ul class="modal__discription-list list">
              <li class="modal__discription-item">
                <span class="modal__discription-title">Vote / Votes</span>
                <span class="modal-value active">${vote_average.toFixed(1)}</span> / 
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
                <span class="modal-value">${createGenreStr(genres, genre_ids)}</span>
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

function pagination(event) {
  event.preventDefault();

  if (event.target.classList.contains('pagination-left')) {
    if (page <= pageItems) {
      page = 1;
    } else {
      page = startPage - pageItems;
    }
    endPage = page + (pageItems - 1);
    startPage = page;
  } else if (event.target.classList.contains('pagination-right')) {
    if (page < totalPages - (pageItems - 1)) {
      page = startPage + pageItems;
      startPage = page;
      endPage =
        page + (pageItems - 1) <= totalPages
          ? page + (pageItems - 1)
          : totalPages;
    }
  } else {
    page = Number(event.target.innerText);
  }
  loadMovies();
}

const createMarkup = (data, genres) => {
  return data
    .map(
      item =>
        `<li class="filmoteka-item" data-id="${item.id}">
          <a href=">
            <div class="filmoteka-thumb">
                <img class="filmoteka-img" src="${postersPath}${
          item.poster_path
        }" alt="${item.overview}" />
            </div>
          </a>
          <h2 class="filmoteka-title">${item.title.toUpperCase()}</h2>
          <p class="filmoteka-discription">${createGenreStr(
            genres,
            item.genre_ids
          )} | ${new Date(item.release_date).getFullYear()}</p>
        </li>`
    )
    .join('');
};

const createPagination = (start, end, activePage) => {
  let markup = '';
  for (let i = start; i <= end; i += 1) {
    markup += `<li class="pagination-item">
              <a class="pagination-link link ${
                i == activePage ? 'active' : ''
              }" href="">${i}</a>
            </li>`;
  }

  return markup;
};

const loadMovies = async () => {
  try {
    // isLoading=true;
    refs.spinner.classList.add('loading');
    movies = await loadData();
    genres = await loadGenre();

    totalPages = movies.total_pages;

    refs.filmotekaList.innerHTML = createMarkup(movies.results, genres);
    refs.paginationList.innerHTML = createPagination(startPage, endPage, page);

    // isLoading=false;
    refs.spinner.classList.remove('loading');
  } catch (error) {
    // isLoading=false;
    refs.spinner.classList.remove('loading');
    console.log(error);
  }
};

loadMovies();
