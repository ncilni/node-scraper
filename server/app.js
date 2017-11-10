var express = require('express');
var path = require('path');
var mlogger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var search = require('./routes/search');
var history = require('./routes/history');
var authentication = require('./routes/authentication');
var users = require('./routes/users');
var app = express();
var router = express.Router();
var expressValidator = require ('express-validator');
//nconf used for Global Configurations
var config = require('nconf');
var appLogger=require('./custom_utils/appLogger');

config.file("config.json");
config.defaults({
  "http": {
    "_appPort": 8000
  }
})
appLogger.logger.info("Intialized : nconf");
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authorization");
  // since the angular http does not show all the custom headers so adding the below code
  res.header("Access-Control-Expose-Headers", "authorization");
  appLogger.logger.info("Incoming Request : ", req.method, " | ", req.url, " | ", req.headers);
  next();
});
//app.use('/api', index);
app.use('/api/authenticate', authentication);
app.use('/api/search', search);
app.use('/api/history', history);
app.use('/api/users', users)

// catch 404 and forward to error handler
app.use(function(req, res) {
  res.sendStatus(404);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
});

app.use('/api', router);
app.listen(config.get('http:_appPort'));
appLogger.logger.info("Server Started .....");
appLogger.logger.info("Port : ", config.get('http:_appPort'));
