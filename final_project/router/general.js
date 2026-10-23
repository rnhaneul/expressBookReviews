const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();
axios.defaults.baseURL = 'http://localhost:5000';

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({
        message: `User ${username} successfully registered. Now you can login`
      });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }

  return res.status(404).json({ message: "Unable to register user." });
});

public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 1));
});

public_users.get('/isbn/:isbn', function (req, res) {
  const ISBN = req.params.isbn;
  res.send(JSON.stringify(books[ISBN], null, 1));
});

public_users.get('/author/:author', function (req, res) {
  const authorName = req.params.author;
  const filtered = Object.values(books).filter(b => b.author === authorName);
  res.send(JSON.stringify(filtered, null, 1));
});

public_users.get('/title/:title', function (req, res) {
  const titleName = req.params.title;
  const filtered = Object.values(books).filter(b => b.title === titleName);
  res.send(JSON.stringify(filtered, null, 2));
});

public_users.get('/review/:isbn', function (req, res) {
  const ISBN = req.params.isbn;
  const foundBook = books[ISBN];
  res.send(JSON.stringify(foundBook.reviews, null, 2));
});

// Axios helper functions
async function fetchBooks() {
  try {
    const response = await axios.get('/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all books:', error.message);
    return [];
  }
}

async function fetchBooksByAuthor(authorName) {
  try {
    const response = await axios.get(`/author/${authorName}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch books by author:', error.message);
    return [];
  }
}

async function fetchBooksByTitle(titleName) {
  try {
    const response = await axios.get(`/title/${titleName}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch books by title:', error.message);
    return [];
  }
}

async function fetchBookByISBN(isbn) {
  try {
    const response = await axios.get(`/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch book by ISBN:', error.message);
    return null;
  }
}
module.exports.general = public_users;