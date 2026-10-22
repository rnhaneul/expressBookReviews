const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ "username": username, "password": password });
      console.log(users)
      return res.status(200).json({ message: `User ${username} successfully registered. Now you can login` });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 1))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const ISBN = req.params.isbn;
  res.send(JSON.stringify(books[ISBN], null, 1))
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const authorName = req.params.author;
  const filtered = Object.values(books).filter(b => b.author === authorName);
  res.send(JSON.stringify(filtered, null, 1));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const titleName = req.params.title;
  const filtered = Object.values(books).filter(b => b.title === titleName);
  res.send(JSON.stringify(filtered, null, 2))
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const ISBN = req.params.isbn;
  const foundBook = books[ISBN];
  res.send(JSON.stringify(foundBook.reviews, null, 2));
});

module.exports.general = public_users;
