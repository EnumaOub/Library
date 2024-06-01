// Factory function for the library not that useful because we have only a single library 
// Could help if we create a library by users
function Library() {
    let myLibrary = [];



    // Get all data stored locally
    const getStored = function() {
        const lib_hist = JSON.parse(localStorage.getItem('lib'));
        for (const book of lib_hist) {
            addBook(book);
        }
    }

    // Get books informations
    const getBookInfo = function() {
        let book_read = 0;
        let book_unread = 0;
        const book_tot = myLibrary.length + 1;
        for (const book of myLibrary) {
            if (book.read) {
                book_read += 1;
            }
            else {
                book_unread += 1;
            }
        }
        return {book_read, book_unread, book_tot};
    }

    // Add a book to our library
    const addBook = function(book) {
        myLibrary.push(book)
        displayLibrary();
        updateHeader();
        localStorage.setItem("lib", JSON.stringify(myLibrary));
    }

    // Invert boolean of read
    const changeRead = function(book_cont, pos) {
        myLibrary[pos].read = !myLibrary[pos].read
        book_cont.className = `book ${myLibrary[pos].read}`;
    }


    //Generate the cards containing the book information
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
            localStorage.setItem("lib", JSON.stringify(myLibrary));
        };

        const btn_delete = document.createElement("button");
        btn_delete.textContent = "del ?"
        btn_delete.onclick = function() {
            myLibrary.splice(pos, 1);
            displayLibrary()
            localStorage.setItem("lib", JSON.stringify(myLibrary));
        }

        book_cont.appendChild(btn_delete);
        book_cont.appendChild(btn_read);
        
        return book_cont;
    } 

    const updateHeader = function() {
        const book_info = getBookInfo();
        const read_tot = document.getElementById("read-tot");
        const unread_tot = document.getElementById("unread-tot");
        const gen_tot = document.getElementById("gen-tot");

        read_tot.textContent = `Book Read: ${book_info.book_read}`;
        unread_tot.textContent = `Book Unread: ${book_info.book_unread}`;
        gen_tot.textContent = `Book Total: ${book_info.book_tot}`;
    }

    // Get all element in the library into the container showing the cards on the page
    const displayLibrary = function() {
        const container = document.getElementById("container-lib");
        container.innerHTML = ""; // Reset container
        let i = 0;
        for (let book of myLibrary) {
            container.appendChild(createCardBook(book, i));
            i += 1;
        }
    }

    return {addBook, getBookInfo, getStored};

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
    // Allow to get the book data from the form
    function getBook() {
        const title = document.getElementById("title");
        const author = document.getElementById("author");
        const pages = document.getElementById("pages");
        const read = document.getElementById("read");
        
        return new Book(title.value, author.value, pages.value, read.checked);
    }

    function GetGeneralBooks() {
        let book_examples = [];

        book_examples.push(new Book("The Hobbit", "J.R.R. Tolkien", "295", false));
        book_examples.push(new Book("MOL", "Domagoj Kurmaić", "644", true));
        book_examples.push(new Book("The Final Empire", "Brandon Sanderson", "541", true));

        return book_examples;
    }

    return {getBook, GetGeneralBooks};
})();

function genSomeBook() {
    const container = document.getElementById("container-lib");

}

function initLibrary() {
    // Give the form its function when submitting.
    const BookForm = document.getElementById("book-info");
    BookForm.addEventListener("submit", function(event){
        event.preventDefault()
        lib.addBook(BookCreator.getBook())
    });

    // Give the delete all button its function.
    const Delete_btn = document.getElementById("delete-all");
    BookForm.addEventListener("submit", function(event){
        lib.addBook(BookCreator.getBook())
    });



}

let lib;

// Generation of the library
lib = Library();
lib.getStored();



document.addEventListener("DOMContentLoaded", function() {
    initLibrary();
});

// for (const book_ex of BookCreator.GetGeneralBooks()) {
//     lib.addBook(book_ex);
// }
