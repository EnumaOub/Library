// Factory function for the library not that useful because we have only a single library 
// Could help if we create a library by users
function Library() {
    let myLibrary = [];

    // Generate div with button allowing to add some of the books
    const genSomeBook = function() {
        const container = document.getElementById("container-lib");
        if (!(container.firstChild)) {
            const library_cont = document.getElementById("library");
            const div = document.createElement("div");
            const btn = document.createElement("button");
            div.id = "gen-data-rd";
            div.textContent = "You can create your library by using the button '+ Add Book' or use the button below to generate some examples:";
            btn.textContent = "Generate Data ?";
            btn.addEventListener("click", function(event){
                for (const book_ex of BookCreator.GetGeneralBooks()) {
                    lib.addBook(book_ex);
                }
            });
            div.appendChild(btn);
            library_cont.appendChild(div);
        }
        else {
            if (document.getElementById("gen-data-rd")) {
                document.getElementById("gen-data-rd").remove();
            }
            

        }

    }

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
                const book_fin = new Book(book.title, book.pages, book.author);
                book_fin.setReadStatus(book._read);
                addBook(book_fin);
            }
            
        }
        updateLibrary();
        
    }

    // Get books informations
    const getBookInfo = function() {
        let book_read = 0;
        let book_unread = 0;
        const book_tot = myLibrary.length;
        for (const book of myLibrary) {
            if (book.getReadStatus()) {
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
        genSomeBook();
    }

    // Add a book to our library
    const addBook = function(book) {
        myLibrary.push(book);
        updateLibrary();
    }

    // Invert boolean of read
    const changeRead = function(book_cont, pos) {
        myLibrary[pos].setReadStatus(!myLibrary[pos].getReadStatus());
        book_cont.className = `book ${myLibrary[pos].getReadStatus()}`;
    }


    //Generate the cards containing the book information
    const createCardBook = function(book, pos) {
        const book_cont = document.createElement("div");
        const btn_cont = document.createElement("div");
        btn_cont.id = "btn-res";
        const id = `book_${pos}`;
        const HTMLString = `
                    <h1>${book.title}</h1>
                    <h3>Written by: ${book.author}</h3>
                    <h5>${book.pages} pages</h5>
                        `;
        book_cont.innerHTML = HTMLString;
        book_cont.id = id;
        book_cont.className = `book ${book.getReadStatus()}`;

        const btn_read = document.createElement("button");
        btn_read.textContent = "read ?"
        btn_read.classList.add("read-btn");
        btn_read.onclick = function() {
            changeRead(book_cont, pos);
            updateLibrary();
        };

        const btn_delete = document.createElement("button");
        btn_delete.textContent = "Del ?";
        btn_delete.classList.add("delete-btn");
        btn_delete.onclick = function() {
            myLibrary.splice(pos, 1);
            updateLibrary();
        }

        btn_cont.appendChild(btn_delete);
        btn_cont.appendChild(btn_read);

        book_cont.appendChild(btn_cont);
        
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
class Book {
    _read = false;

    constructor(title, author, pages) {
        this.title = title;
        this.author = author;
        this.pages = pages;
    }

    setReadStatus(value) {
        if (typeof(value) == "boolean") {
            this._read = value;
        }
    }

    getReadStatus() {
        return this._read;
    }
    
}


// Module Pattern to get the book
const BookCreator = (function(){
    // Allow to get the book data from the form
    function getBook() {
        const title = document.getElementById("title");
        const author = document.getElementById("author");
        const pages = document.getElementById("pages");
        const read = document.getElementById("read");
        
        let book = new Book(title.value, author.value, pages.value);
        book.setReadStatus(read.checked);
        clearForm(title, author, pages, read);
        return book
    }

    function clearForm(title, author, pages, read) {
        title.value = "";
        author.value = "";
        pages.value = "";
        read.checked = false;


    }

    function GetGeneralBooks() {
        let book_examples = [];

        let book = new Book("The Hobbit", "J.R.R. Tolkien", "295");
        book.setReadStatus(false);
        book_examples.push(book);
        book = new Book("Mother of Learning", "Domagoj Kurmaić", "644");
        book.setReadStatus(true);
        book_examples.push(book);
        book = new Book("The Final Empire", "Brandon Sanderson", "541");
        book.setReadStatus(true);
        book_examples.push(book);
        book = new Book("Eragon", "Christopher Paolini", "503", "644");
        book.setReadStatus(false);
        book_examples.push(book);
        book = new Book("A Darker Shade of Magic", "V.E. Schwab", "400");
        book.setReadStatus(true);
        book_examples.push(book);
        book = new Book("Leviathan Wakes", "James S.A. Corey", "592");
        book.setReadStatus(true);
        book_examples.push(book);
        book = new Book("Foundryside", "Robert Jackson Bennett", "501");
        book.setReadStatus(true);
        book_examples.push(book);
        book = new Book("The Name of the Wind", "Patrick Rothfuss", "662");
        book.setReadStatus(true);
        book_examples.push(book);
        book = new Book("The Alloy of Law", "Brandon Sanderson", "332");
        book.setReadStatus(false);
        book_examples.push(book);
        book = new Book("Storm Front", "Jim Butcher", "355", "501");
        book.setReadStatus(true);
        book_examples.push(book);
        book = new Book("The Thousand Names", "Django Wexler", "513");
        book.setReadStatus(false);
        book_examples.push(book);
        book = new Book("Sabriel", "Garth Nix", "491");
        book.setReadStatus(false);
        book_examples.push(book);

        return book_examples;
    }

    return {getBook, GetGeneralBooks};
})();



function initLibrary() {
    // Generation of the library
    lib = Library();
    lib.getStored();

    // Get form dialog id
    const form = document.getElementById("form-show");

    // Give the form its function when submitting.
    const BookForm = document.getElementById("book-info");
    BookForm.addEventListener("submit", function(event){
        event.preventDefault()
        lib.addBook(BookCreator.getBook())
        form.close();
    });

    // Give the delete all button its function.
    const Delete_btn = document.getElementById("delete-all");
    Delete_btn.addEventListener("click", function(event){
        lib.deleteAll()
    });

    const Add_btn = document.getElementById("add-elem");
    Add_btn.addEventListener("click", function(event){
        form.showModal();
    });

    const close_form_btn = document.getElementById("close-form");
    close_form_btn.addEventListener("click", function(event){
        form.close();
    });

}

let lib;



document.addEventListener("DOMContentLoaded", function() {
    initLibrary();
});

// for (const book_ex of BookCreator.GetGeneralBooks()) {
//     lib.addBook(book_ex);
// }
