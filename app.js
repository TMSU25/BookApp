const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const booksRouter = require("./routes/books");
const fs = require("fs");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Home route - Now serves index.ejs
app.get("/", (req, res) => {
  const books = JSON.parse(fs.readFileSync("./data/books.json", "utf-8")); // Read latest data
  res.render("index", { books }); // Render index.ejs with updated books list
});

// Use the booksRouter for all routes related to /books
app.use("/books", booksRouter);

// Export the app
module.exports = app;
