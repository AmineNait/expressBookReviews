const express = require("express");
let books = require("./booksdb.js");
let doesExist = require("./auth_users.js").doesExist;
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    // Check if the user does not already exist
    if (!doesExist(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.send(book);
  } else {
    res.status(404).send("Unable to find book!");
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  let bookByAuthor = [];

  for (let key in books) {
    if (books[key].author === author) {
      bookByAuthor.push(books[key]);
    }
  }

  if (bookByAuthor.length > 0) {
    res.status(200).json(bookByAuthor);
  } else {
    res.status(404).send("No books found by this author.");
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let bookByTitle = [];

  for (let key in books) {
    if (books[key].title === title) {
      bookByTitle.push(books[key]);
    }
  }

  if (bookByTitle.length > 0) {
    res.status(200).json(bookByTitle);
  } else {
    res.status(404).send("No books found by this title.");
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    const reviews = book.reviews;

    if (reviews && Object.keys(reviews).length > 0) {
      res.status(200).json(reviews);
    } else {
      res.status(200).json({ message: "No reviews available for this book." });
    }
  } else {
    res.status(404).send("Unable to find book!");
  }
});

module.exports.general = public_users;
