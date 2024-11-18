const newBookBtn = document.getElementById('new-book-btn');
const bookDialog = document.getElementById('book-dialog');
const bookForm = document.getElementById('book-form');
const cancelBtn = document.getElementById('cancel-btn');
const coverInput = document.getElementById('cover');
const coverPreview = document.querySelector('.cover-preview');
const readerDialog = document.getElementById('reader-dialog');
const readerTitle = document.getElementById('reader-title');
const leftPage = document.getElementById('left-page');
const rightPage = document.getElementById('right-page');
const pageCounter = document.getElementById('page-counter');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const closeReaderBtn = document.getElementById('close-reader');

newBookBtn.addEventListener('click', () => {
    
    console.log('Add book button clicked');
});

newBookBtn.addEventListener('click', () => {
    bookDialog.showModal();
});

cancelBtn.addEventListener('click', () => {
    bookDialog.close();
    bookForm.reset();
    coverPreview.innerHTML = '';
});

closeReaderBtn.addEventListener('click', () => {
    readerDialog.close();
    currentBook = null;
    currentSpread = 0;
});

nextPageBtn.addEventListener('click', nextSpread);
prevPageBtn.addEventListener('click', prevSpread);

document.addEventListener('keydown', (e) => {
    if (readerDialog.open) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            nextSpread();
            e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
            prevSpread();
            e.preventDefault();
        } else if (e.key === 'Escape') {
            readerDialog.close();
            currentBook = null;
            currentSpread = 0;
        }
    }
});

let currentBook = null;
let currentSpread = 0; 

function Book(title, author, pages, read, coverUrl = null) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.coverUrl = coverUrl;
}

const myLibrary = [];

function createBookCard(book, index) {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    bookCard.setAttribute('data-index', index);

    const coverContainer = document.createElement('div');
    coverContainer.classList.add('book-cover');
    coverContainer.addEventListener('click', () => openReader(book));
    
    if (book.coverUrl) {
        const coverImg = document.createElement('img');
        coverImg.src = book.coverUrl;
        coverImg.alt = `${book.title} cover`;
        coverContainer.appendChild(coverImg);
    } else {
        coverContainer.classList.add('no-image');
        coverContainer.innerHTML = '<i class="fas fa-book fa-2x"></i>';
    }

    const bookInfo = document.createElement('div');
    bookInfo.classList.add('book-info');

    const title = document.createElement('h3');
    title.classList.add('book-title');
    title.textContent = book.title;

    const author = document.createElement('div');
    author.classList.add('book-author');
    author.textContent = book.author;

    const actions = document.createElement('div');
    actions.classList.add('book-actions');

    const readBtn = document.createElement('button');
    readBtn.innerHTML = book.read ? 
        '<i class="fas fa-check" title="Mark as unread"></i>' : 
        '<i class="fas fa-times" title="Mark as read"></i>';
    readBtn.addEventListener('click', () => toggleReadStatus(index));

    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    removeBtn.addEventListener('click', () => removeBook(index));

    actions.appendChild(readBtn);
    actions.appendChild(removeBtn);

    bookInfo.appendChild(title);
    bookInfo.appendChild(author);
    bookInfo.appendChild(actions);

    bookCard.appendChild(coverContainer);
    bookCard.appendChild(bookInfo);

    return bookCard;
}

function displayBooks() {
    const libraryContainer = document.getElementById('library-container');
    libraryContainer.innerHTML = '';
    myLibrary.forEach((book, index) => {
        const bookCard = createBookCard(book, index);
        libraryContainer.appendChild(bookCard);
    });
}

const sampleBooks = [
    new Book('The Hobbit', 'J.R.R. Tolkien', 295, false, 'images/thehobbit.jpg'),
    new Book('1984', 'George Orwell', 328, true, 'images/1984.jpg'),
    new Book('Pride and Prejudice', 'Jane Austen', 432, false, 'images/prideandprejudice.jpg')
];

coverInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            coverPreview.innerHTML = `<img src="${e.target.result}" alt="Cover preview">`;
        };
        reader.readAsDataURL(file);
    }
});

bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addBookToLibrary();
    bookDialog.close();
    bookForm.reset();
    coverPreview.innerHTML = '';
});

function addBookToLibrary() {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = parseInt(document.getElementById('pages').value);
    const read = document.getElementById('read').checked;
    
    let coverUrl = null;
    if (coverPreview.querySelector('img')) {
        coverUrl = coverPreview.querySelector('img').src;
    }

    const newBook = new Book(title, author, pages, read, coverUrl);
    myLibrary.push(newBook);
    displayBooks();
}

function openReader(book) {
    currentBook = book;
    currentSpread = 0;
    readerTitle.textContent = book.title;
    updateSpreadContent();
    readerDialog.showModal();
}

function updateSpreadContent() {
    const leftPageNum = currentSpread * 2;
    const rightPageNum = leftPageNum + 1;

    if (leftPageNum === 0) {
        leftPage.innerHTML = '<div class="page-content"></div>';
    } else {
        leftPage.innerHTML = `<div class="page-content">Example Page ${leftPageNum}</div>`;
    }

    if (rightPageNum <= currentBook.pages) {
        rightPage.innerHTML = `<div class="page-content">Example Page ${rightPageNum}</div>`;
    } else {
        rightPage.innerHTML = '<div class="page-content"></div>';
    }

    pageCounter.textContent = `${rightPageNum} of ${currentBook.pages}`;

    prevPageBtn.disabled = currentSpread === 0;
    nextPageBtn.disabled = rightPageNum >= currentBook.pages;
}

function nextSpread() {
    if ((currentSpread * 2 + 2) < currentBook.pages) {
        currentSpread++;
        updateSpreadContent();
    }
}

function prevSpread() {
    if (currentSpread > 0) {
        currentSpread--;
        updateSpreadContent();
    }
}

sampleBooks.forEach(book => myLibrary.push(book));
displayBooks();