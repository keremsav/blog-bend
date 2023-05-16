const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Import and configure passport for authentication
const passport = require('passport');
require('dotenv').config();
require('./config/passport');

// Import routers for different routes
const authRouter = require('./routes/authRoutes');
const blogRouter = require('./routes/blogRoutes');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const tagRouter = require('./routes/tagsRoutes');

// Set up the connection to the MongoDB database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Blog', {
  useNewUrlParser: true
})
    .then(() => {
      console.log('Connected to DB');
    })
    .catch(err => {
      console.log(err);
    });

const app = express();

// Configure view engine and static file directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 *-------------- SESSION SETUP ----------------
 */

// Set up session middleware with MongoDB as the session store
const db = process.env.DB;
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: db,
    ttl: 24 * 60 * 60, // 1 day (default)
  })
}));

/**
 *-------------- PASSPORT AUTHENTICATION ----------------
 **/

// Initialize and use Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set up routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', authRouter);
app.use('/', blogRouter);
app.use('/',tagRouter);

// Handle 404 error
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Middleware to log session and user information
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});

module.exports = app;
