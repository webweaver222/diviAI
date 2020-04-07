var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const cors = require('cors')




//db connect

mongoose.connect('mongodb://127.0.0.1:27017/diviai_db', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true 
})

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth')
var profileRouter = require('./routes/profile')
var friendsRouter = require('./routes/friends')
var postRouter = require('./routes/post')

var app = express();




var corsOptions = {
  origin: 'http://localhost:8000',
  optionsSuccessStatus: 200,
  credentials: true // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))


app.use(logger('dev'));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




app.use('/', indexRouter);
app.use('/auth', authRouter)
app.use('/profile', profileRouter)
app.use('/friends', friendsRouter)
app.use('/post', postRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err)
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
