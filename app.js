const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//  Manually set security headers (ZAP scan suggestions)
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY"); // Prevent clickjacking
  res.setHeader("X-Content-Type-Options", "nosniff"); // Prevent MIME-type sniffing
  res.setHeader("X-XSS-Protection", "1; mode=block"); // Enable XSS filtering
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload"); // Enforce HTTPS
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=()"); // Restrict browser features
  res.setHeader("Referrer-Policy", "no-referrer"); // Do not send referrer header
  res.setHeader("Content-Security-Policy", "default-src 'self'"); // Restrict sources of content
  next();
});

app.use('/', indexRouter);
app.use('/books', booksRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
