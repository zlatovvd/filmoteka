export class Pagination {

    perPage = 10;
    currentPage = 1;
    totalPages = 20;

    constructor() {
    }

    creatPagination(currentPage, perPage=20, totalPages=400) {

        this.currentPage = currentPage;
        this.perPage = perPage;
        this.totalPages = totalPages;

        let markup = this.createStartElements();
        let startPage = 1
        let endPage = this.perPage;

        if (this.currentPage >= (this.perPage)) {
            startPage = this.currentPage;
            endPage = this.perPage + (startPage - 1);
            console.log(1);
        }

        if (this.currentPage >= (this.totalPages - this.perPage)) {
            startPage = this.totalPages - (this.perPage + 3);
            endPage = startPage + this.perPage;
            console.log(2);
        }

        if (this.currentPage > this.totalPages-this.perPage) {
            startPage = this.totalPages -this.perPage + 1;
            endPage = this.totalPages;
            console.log(3);
        }

        if (this.currentPage-this.perPage < 0 & this.currentPage+this.perPage >= this.totalPages) {
            startPage = 4;
            endPage = this.totalPages - 4;
            console.log(4);
        }

        if (this.perPage >=this.totalPages) {
            startPage = 1;
            endPage = this.totalPages;
            console.log(5);
        }

        if (this.totalPages <= 10) {
            startPage = 1;
            endPage = this.totalPages;
        }

        console.log(6);

        for (let i = startPage; i <= endPage; i += 1) {
            if (i === this.currentPage) {
                markup += `<li class="pagination-item active"><span>${i}</span></li>`;
            } else {
                markup += `<li class="pagination-item"><a href="" class="pagination-link">${i}</a></li>`;
            }

        }

        markup += this.createEndElements();

        return markup;
    }

    createStartElements() {
        
        if (this.totalPages<=10) {
            return '<li class="pagination-item"><a href="" class="pagination-link link page-left"></a></li>';
        }

        //if ((this.currentPage >= (this.perPage)) | this.currentPage-this.perPage < 0 & this.currentPage+this.perPage >= this.totalPages) {
        if ((this.currentPage >= (this.perPage))) {            
            return `<li class="pagination-item"><a href="" class="pagination-link link page-left"></a></li>
                    <li class="pagination-item"><a href="" class="pagination-link link">1</a></li>
                    <li class="pagination-item"><a href="" class="pagination-link link">2</a></li>
                    <li class="pagination-item"><span>...</span></li>`;
        }

        if (this.currentPage === 1 | this.totalPages<=10) {
            return '<li class="pagination-item"><span class=" page-left"></span></li>';
        }
        
        return '<li class="pagination-item"><a href="" class="pagination-link link page-left"></a></li>';
    }

    createEndElements() {

        if ((this.currentPage === this.totalPages) | this.totalPages<=10) {
            return '<li class="pagination-item"><span class="page-right"></span></li>';
        }

        //if ((this.currentPage <= (this.totalPages - this.perPage)) | (this.currentPage-this.perPage < 0 & this.currentPage+this.perPage >= this.totalPages)) {
        if ((this.currentPage <= (this.totalPages - this.perPage))) {            
            return `<li class="pagination-item"><span>...</span></li>
                    <li class="pagination-item"><a href="" class="pagination-link link">${this.totalPages - 1}</a></li>
                    <li class="pagination-item"><a href="" class="pagination-link link">${this.totalPages}</a></li>
                    <li class="pagination-item"><a href="" class="pagination-link link page-right"></a></li>`;
        }
        
        return '<li class="pagination-item"><a href="" class="pagination-link link page-right"></a></li>';
    }

    setPerPage(perPage) {
        this.perPage = perPage;
    }

    setCurrentPage(currentPage) {
        this.currentPage = currentPage;
    }

    setTotalPage(totalPages) {
        this.totalPages = totalPages;
    }

}