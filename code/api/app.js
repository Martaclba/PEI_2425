var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');

var app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// view engine setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/', indexRouter);
//app.use('/users', usersRouter);

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
  res.status(404).json({error: err, msg: "Pedido não suportado"})
});

module.exports = app;
