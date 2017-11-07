var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var mlogger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var search = require('./routes/search'); 
var history = require('./routes/history');
var authentication = require('./routes/authentication');
var users = require('./routes/users');
var app = express();
var router = express.Router();
//nconf used for Global Configurations
var config = require('nconf');

//winston used for logging
var winston = require('winston');
require('winston-daily-rotate-file');

var transport = new (winston.transports.DailyRotateFile)({
  filename: './logs/log',
  datePattern: 'yyyy-MM-dd.',
  prepend: true,
  level: process.env.ENV === 'development' ? 'debug' : 'info'
});

var logger = new (winston.Logger)({
  transports: [
    transport
  ]
});

config.file("config.json");
config.defaults({
  "http": {
    "_appPort": 8000
  }
})
logger.info("Intialized : nconf");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');	
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/api', index);
app.use('/api/authenticate', authentication);
app.use('/api/search', search);
app.use('/api/history', history);
app.use('/api/users', users)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
});

app.use('/api', router);
app.listen(config.get('http:_appPort'));
logger.info("Server Started .....");
logger.info("Port : ", config.get('http:_appPort'));
