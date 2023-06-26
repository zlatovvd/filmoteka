export class StorageApi {
  data = [];
  page = 1;
  perPage = 4;
  totalPages = 1;

  getData(storageName) {
    this.data = window.localStorage.getItem(storageName)
      ? JSON.parse(window.localStorage.getItem(storageName))
      : [];
    this.totalPages = Math.ceil(this.data.length / this.perPage);

    return {
      result: this.data.slice(this.startElement(), this.endElement()),
      totalPages: this.totalPages,
      perPage: this.perPage,
      currentPage: this.page,
    };
  }

  incrementPage() {
    this.page += 1;
  }

  decrementPage() {
    this.page -= 1;
  }

  setPage(page) {
    this.page = page;
  }

  getPage() {
    return this.page;
  }

  startElement() {
    return this.page * this.perPage - this.perPage;
  }

  endElement() {
    let endElement = this.startElement() + this.perPage;
    console.log('length', this.data.length);

    if (this.startElement() + this.perPage > this.data.length) {
      endElement = this.data.length;
    }

    return endElement;
  }
}
