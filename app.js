const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const booksRouter = require("./routes/books");
const fs = require("fs");

const app = express();

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Security headers (to pass ZAP scan)
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY"); // Prevent clickjacking
  res.setHeader("X-Content-Type-Options", "nosniff"); // Prevent MIME type sniffing
  res.setHeader("X-XSS-Protection", "1; mode=block"); // Basic XSS protection
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload"); // Enforce HTTPS
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=()"); // Disable certain browser features
  res.setHeader("Referrer-Policy", "no-referrer"); // Hide referrer info
  res.setHeader("Content-Security-Policy", "default-src 'self'"); // Only allow self-hosted content
  next();
});

// Manually define root route (instead of using indexRouter)
app.get("/", (req, res) => {
  const books = JSON.parse(fs.readFileSync("./data/books.json", "utf-8"));
  res.render("index", { books });
});

// Book routes
app.use("/books", booksRouter);

// 404 handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {}
  });
});

module.exports = app;
