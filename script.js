// Factory function for the library not that useful because we have only a single library 
// Could help if we create a library by users
function Library() {
    let myLibrary = [];

    //Delete all data
    const deleteAll = function() {
        localStorage.removeItem("lib");
        myLibrary = [];
        updateLibrary();
    }

    // Get all data stored locally
    const getStored = function() {
        if (localStorage.getItem('lib')) {
            const lib_hist = JSON.parse(localStorage.getItem('lib'));
            for (const book of lib_hist) {
                addBook(book);
            }
        }
        
    }

    // Get books informations
    const getBookInfo = function() {
        let book_read = 0;
        let book_unread = 0;
        const book_tot = myLibrary.length;
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

    // Update general display and the local memory
    const updateLibrary = function() {
        displayLibrary();
        updateHeader();
        localStorage.setItem("lib", JSON.stringify(myLibrary));
    }

    // Add a book to our library
    const addBook = function(book) {
        myLibrary.push(book);
        updateLibrary();
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
            updateLibrary();
        };

        const btn_delete = document.createElement("button");
        btn_delete.textContent = "del ?"
        btn_delete.onclick = function() {
            myLibrary.splice(pos, 1);
            updateLibrary();
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

    return {addBook, getBookInfo, getStored, deleteAll};

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
    if (!(container.firstChild)) {
        const library_cont = document.getElementById("library");
        const div = document.createElement("div");
        const btn = document.createElement("button");
        div.id = "gen-data-rd";
        div.textContent = "You can create your library or use the button below to generate some examples:";
        btn.textContent = "Generate Data ?";
        BookForm.addEventListener("submit", function(event){
            for (const book_ex of BookCreator.GetGeneralBooks()) {
                lib.addBook(book_ex);
            }
        });
        div.appendChild(btn);
        library_cont.appendChild(div);
    }

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
    Delete_btn.addEventListener("click", function(event){
        lib.deleteAll()
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
