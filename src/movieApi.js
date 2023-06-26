import axios from 'axios';

export class movieApi {
  baseUrl = 'https://api.themoviedb.org/3';
  apiKey = 'bf849ac9154ddcf14074361fb0f94011';
  page = 1;
  query = '';

  constructor() {}

  getData = async () => {
    const url =
      this.query !== ''
        ? `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${this.query}&page=${this.page}`
        : `${this.baseUrl}/trending/movie/day?api_key=${this.apiKey}&page=${this.page}`;
    const movies = await axios.get(url);
    
    return movies;
  };

  loadGenre = async () => {
    const url = `${this.baseUrl}/genre/movie/list?language=en&api_key=${this.apiKey}`;
    const genre = await axios.get(url);
    return genre.data.genres;
  };

  setPage(page) {
    this.page = page;
  }

  getPage() {
    return this.page;
  }

  incrementPage(increment = 1) {
    this.page += increment;
  }

  decrementPage(decrement = 1) {
    this.page -= decrement;
  }

  setQuery(query) {
    this.query = query;
    this.page = 1;
  }


}
