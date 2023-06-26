'use strict';

import { movieApi } from './movieApi';
import { Pagination } from './Pagination';
import { StorageApi } from './StorageApi';

const postersPath = 'https://image.tmdb.org/t/p/w500';

let genres = null;
let perPage = 4;
let storageName = 'watched';

const dataApi = new movieApi();
const pagination = new Pagination();
const storageApi = new StorageApi();

const refs = {
  filmotekaList: document.querySelector('.filmoteka-list'),
  //queueBtn: document.querySelector('.queue-btn'),
  btns: document.querySelector('.library-btn-wrapper'),
  watchedBtn: document.querySelector('.watched-btn'),
  paginationList: document.querySelector('.pagination-list'),
};

refs.paginationList.addEventListener('click', handlePagination);
refs.btns.addEventListener('click', handleBtns);

const loadLibrary = async () => {
  if (!genres) {
    try {
      genres = await dataApi.loadGenre();
    } catch {
      console.error(error);
    }
  }
  const { result, totalPages, perPage, currentPage } =
    storageApi.getData(storageName);
  refs.filmotekaList.innerHTML = createMarkup(result);

  console.log('total', totalPages);

  if (totalPages > 1) {
    refs.paginationList.innerHTML = pagination.creatPagination(
      currentPage,
      perPage,
      totalPages
    );
  } else {
    refs.paginationList.innerHTML = '';
  }
};

const createGenreStr = genre_ids => {
  return genre_ids
    .map(item => genres.find(option => option.id == item).name)
    .join(', ');
};

function handleBtns(event) {
  refs.watchedBtn.classList.remove('active');

  if (event.target.classList.contains('queue-btn')) {
    storageName = 'queue';
  } else if (event.target.classList.contains('watched-btn')) {
    storageName = 'watched';
  }
  storageApi.setPage(1);
  loadLibrary();
}

function handlePagination(event) {
  event.preventDefault();

  if (event.target.classList.contains('pagination-link')) {
    if (event.target.classList.contains('page-right')) {
      storageApi.incrementPage();
    } else if (event.target.classList.contains('page-left')) {
      storageApi.decrementPage();
    } else {
      storageApi.setPage(Number(event.target.innerText));
    }

    loadLibrary();
  }
}

const createMarkup = data => {
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
              item.genre_ids
            )} | ${new Date(item.release_date).getFullYear()}</p>
          </li>`
    )
    .join('');
};

loadLibrary();
