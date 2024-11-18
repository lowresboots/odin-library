const newBookBtn = document.getElementById('new-book-btn');

newBookBtn.addEventListener('click', () => {
    
    console.log('Add book button clicked');
});

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

sampleBooks.forEach(book => myLibrary.push(book));
displayBooks();