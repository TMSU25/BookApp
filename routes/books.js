const express = require("express");
const fs = require("fs");
const router = express.Router();
const filePath = "./data/books.json";


// Function to read books from the JSON file
const getBooks = () => {
  try {
    return JSON.parse(fs.readFileSync(filePath)); // Reading the file
  } catch (err) {
    console.error("Error reading books data: ", err);
    return [];
  }
};

// Function to save books to the JSON file
const saveBooks = (books) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(books, null, 2)); // Writing to the file
  } catch (err) {
    console.error("Error writing books data: ", err);
  }
};

// Home Page (Display Books)
// router.get("/", (req, res) => {
//   const books = getBooks(); // Get the books data
//   const editId = req.query.edit;
//   const bookToEdit = books.find(book => book.id == editId);

//   res.render("books", { books: books, book: bookToEdit || {} });
// });

// Home Page (Display Books)
router.get("/", (req, res) => {
  const books = getBooks(); // Fetch latest book data
  res.render("index", { books }); // Render index.ejs with updated books list
});


// new line
router.get("/manage", (req, res) => {
  const books = getBooks();
  const editId = req.query.edit;
  const bookToEdit = books.find(book => book.id == editId);
  res.render("books", { books: books, book: bookToEdit || {} });
});


// Add or Update Book (Handle Add or Update)
router.post("/", (req, res) => {
  const books = getBooks();

  if (req.body.id) {
    // Update an existing book
    const bookIndex = books.findIndex(book => book.id == req.body.id);
    if (bookIndex !== -1) {
      books[bookIndex].title = req.body.title;
      books[bookIndex].author = req.body.author;
    }
  } else {
    // Add a new book
    const newBook = { id: Date.now(), title: req.body.title, author: req.body.author };
    books.push(newBook);
  }

  // Save the updated books data
  saveBooks(books);

  // Redirect to the books page to show the updated list
  res.redirect("/books/manage");
});

// Delete Book
router.post("/delete/:id", (req, res) => {
  let books = getBooks();
  books = books.filter(book => book.id != req.params.id);
  saveBooks(books);

  // Redirect back to the books page
  res.redirect("/books/manage");
});

module.exports = router;
