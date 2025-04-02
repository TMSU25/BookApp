const express = require('express');
const path = require('path');

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');

const app = express();

// Built-in middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Security headers manually set
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY"); // Prevent clickjacking
  res.setHeader("X-Content-Type-Options", "nosniff"); // Prevent MIME-type sniffing
  res.setHeader("X-XSS-Protection", "1; mode=block"); // Basic XSS protection
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload"); // Force HTTPS
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=()"); // Restrict browser features
  res.setHeader("Referrer-Policy", "no-referrer"); // Don't send referrer header
  res.setHeader("Content-Security-Policy", "default-src 'self'"); // Block external sources
  next();
});

// Route handlers
app.use('/', indexRouter);
app.use('/books', booksRouter);

// Handle 404 errors
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Global error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
