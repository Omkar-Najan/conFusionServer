var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

var session = require('express-session');
var FileStore = require('session-file-store')(session);

//passport auth
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config')


// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(express.static(path.join(__dirname, 'public')));

// passport auth

// Use of Cookies
// use of signed cookies so parse secret key 
// app.use(cookieParser('12345-67890-09876-54321'));   // commenting cookie parser as session is being used. 

// Use session
// app.use(session({
// 	name:'session-id',
// 	secret: '12345-67890-09876-54321',
// 	saveUninitialized : false,
// 	resave: false,
// 	store: new FileStore()
// }))

app.use(passport.initialize());
// app.use(passport.session());


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);


// ==================================================================//




var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promotionRouter');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// connect app with mongodb database 
const mongoose = require('mongoose');


// imort schema
const Dishes = require('./models/dishes');
const { notDeepStrictEqual, notEqual } = require('assert');
const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db)=>{
  console.log('Connected to mongodb server !');
  }, 
  (err) => {console.log(err)}
);



app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);

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

module.exports = app;
