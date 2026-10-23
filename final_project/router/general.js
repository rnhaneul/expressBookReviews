const express = require('express');
const axios = require('axios');

const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');

const public_users = express.Router();
axios.defaults.baseURL = 'http://localhost:5000';

// Helper used to filter books by a specific property
function filterBooksBy(field, value) {
  return Object.values(books).filter(book => book[field] === value);
}

// Register a new user
public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: 'User already exists!' });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: `User ${username} successfully registered. Now you can login`
  });
});

// Get the complete book catalog
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 1));
});

// Get a book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const ISBN = req.params.isbn;
  const book = books[ISBN];

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  return res.send(JSON.stringify(book, null, 1));
});

// Get books by author
public_users.get('/author/:author', function (req, res) {
  const authorName = req.params.author;
  const filteredBooks = filterBooksBy('author', authorName);

  return res.send(JSON.stringify(filteredBooks, null, 1));
});

// Get books by title
public_users.get('/title/:title', function (req, res) {
  const titleName = req.params.title;
  const filteredBooks = filterBooksBy('title', titleName);

  return res.send(JSON.stringify(filteredBooks, null, 1));
});

// Get reviews for a specific book
public_users.get('/review/:isbn', function (req, res) {
  const ISBN = req.params.isbn;
  const foundBook = books[ISBN];

  if (!foundBook) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  return res.send(JSON.stringify(foundBook.reviews, null, 2));
});

// Fetch all books using Axios
async function fetchBooks() {
  try {
    const response = await axios.get('/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all books:', error.message);
    return [];
  }
}

// Fetch books by author using Axios
async function fetchBooksByAuthor(authorName) {
  try {
    const response = await axios.get(`/author/${authorName}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch books by author:', error.message);
    return [];
  }
}

// Fetch books by title using Axios
async function fetchBooksByTitle(titleName) {
  try {
    const response = await axios.get(`/title/${titleName}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch books by title:', error.message);
    return [];
  }
}

// Fetch one book by ISBN using Axios
async function fetchBookByISBN(isbn) {
  try {
    const response = await axios.get(`/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch book by ISBN:', error.message);
    return null;
  }
}

// Export the router and helper functions
module.exports.general = public_users;
module.exports.fetchBooks = fetchBooks;
module.exports.fetchBooksByAuthor = fetchBooksByAuthor;
module.exports.fetchBooksByTitle = fetchBooksByTitle;
module.exports.fetchBookByISBN = fetchBookByISBN;