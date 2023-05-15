var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let session = require('express-session');
const MongoStore = require('connect-mongo');
let mongoose = require('mongoose');
let passport = require('passport');
require('dotenv').config();
require('./config/passport');

let authRouter = require('./routes/authRoutes')


mongoose.connect('mongodb://localhost:27017/Blog',{
  useNewUrlParser : true
})
    .then(()=> {
      console.log('connected to DB')
    })
    .catch(err => {
      console.log(err);
    })

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let db = process.env.DB


app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: db,
    ttl:  24 * 60 * 60 , // = 1 days. Default
  })
}));
app.use(passport.initialize());

app.use(passport.session());



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/',authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 *-------------- SESSION SETUP ----------------
 */


/**
 *-------------- PASSPORT AUTHENTICATION ----------------
**/

// Need to require the entire Passport config module so app.js knows about it


app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});
let PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`)
})

module.exports = app;
