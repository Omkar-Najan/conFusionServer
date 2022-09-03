var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(express.static(path.join(__dirname, 'public')));

// Use of Cookies
// use of signed cookies so parse secret key 
app.use(cookieParser('12345-678906-54321')); 

// ================================================================//
// Adding AUthentication

//====================================================================
/*
Writing auth function before routers and before express() so 
anybody can not access data without authentication. 
*/ 
function auth(req,res,next){
    console.log(req.signedCookies);

    if(!req.signedCookies.user){
      var authHeader = req.headers.authorization;
      if(!authHeader){
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status= 401;
        next(err);
        return;
      }
      var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(":");
      var user = auth[0];
      var pass = auth[1];
      if(user  == 'admin' && pass == 'password'){
        res.cookie('user','admin',{ signed:true })
		next();
      }else {
        var err = new Error('You are not authenticated!')
        res.setHeader('WWW-Authenticate', 'Basic')
        err.status = 401;
        return next(err);
      }
  }else{
	if(req.signedCookies.user == 'admin'){
		next();
	}else{
		var err = new Error('You are not authenticated!')
		err.status = 401;
        return next(err);
	}
  }
}

  
app.use(auth);

// ==================================================================//



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
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
const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db)=>{
  console.log('Connected to mongodb server !');
  }, 
  (err) => {console.log(err)}
);


app.use('/', indexRouter);
app.use('/users', usersRouter);
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
