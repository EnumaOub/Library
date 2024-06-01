// Factory function for the library not that useful because we have only a single library 
// Could help if we create a library by users
function Library() {
    let myLibrary = [];

    const addBook = function(book) {
        myLibrary.push(book)
        displayLibrary();
    }

    const changeRead = function(book_cont, pos) {
        myLibrary[pos].read = !myLibrary[pos].read
        book_cont.className = `book ${myLibrary[pos].read}`;
    }

    const createCardBook = function(book, pos) {
        const book_cont = document.createElement("div");
        const id = `book_${pos}`;
        const HTMLString = `
                    <h1>${book.title}</h1>
                    <h3>Written by: ${book.author}</h3>
                    <h5>${book.pages} pages</h5>
                        `;
        book_cont.innerHTML = HTMLString;
        book_cont.id = id;
        book_cont.className = `book ${book.read}`;

        const btn_read = document.createElement("button");
        btn_read.textContent = "read ?"
        btn_read.onclick = function() {
            changeRead(book_cont, pos);
        };

        const btn_delete = document.createElement("button");
        btn_delete.textContent = "del ?"
        btn_delete.onclick = function() {
            myLibrary.splice(pos, 1);
            displayLibrary()
        }

        book_cont.appendChild(btn_delete);
        book_cont.appendChild(btn_read);
        
        return book_cont;
    }

    const displayLibrary = function() {
        const container = document.getElementById("container-lib");
        container.innerHTML = ""; // Reset container
        let i = 0;
        for (let book of myLibrary) {
            container.appendChild(createCardBook(book, i));
            i += 1;
        }
    }

    return {addBook};

}

// Constructor for the Book object
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}


// Module Pattern to get the book
const BookCreator = (function(){
    
    function getBook() {
        const title = document.getElementById("title");
        const author = document.getElementById("author");
        const pages = document.getElementById("pages");
        const read = document.getElementById("read");
        
        return new Book(title.value, author.value, pages.value, read.checked);
    }

    return {getBook};
})();


const lib = Library();

let BookForm = document.getElementById("book-info");
BookForm.addEventListener("submit", function(event){
    event.preventDefault()
    lib.addBook(BookCreator.getBook())
  });

const book_ex1 = new Book("The Hobbit", "J.R.R. Tolkien", "295", false);
const book_ex2 = new Book("MOL", "Domagoj Kurmaić", "644", true);
const book_ex3 = new Book("The Final Empire", "Brandon Sanderson", "541", true);

lib.addBook(book_ex1);
lib.addBook(book_ex2);
lib.addBook(book_ex3);