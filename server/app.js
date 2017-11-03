var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');


var search = require('./routes/search'); 
var history = require('./routes/history');
var authentication = require('./routes/authentication');
var user = require('./routes/user');
var app = express();
var router = express.Router();
var _PORT = 8020;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');	
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Creating mysql Database connection
var databaseConnection = mysql.createConnection({
  host     : 'mysql.intelegencia.com',
  user     : 'user_listbuilder',
  password : 'intel@01',
  database : 'list_builder'
});
databaseConnection.connect(function(err){
if(!err) {
  console.log("Connected to Database :", databaseConnection.host);
  } else {
  console.log("Unable to connect to Database ");
  }
});


//app.use('/api', index);
app.use('/api/authenticate', authentication);
app.use('/api/search', search);
app.use('/api/history', history);
app.use('/api/user', user)

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

  // render the error page
  res.status(err.status || 500);
});

app.use('/api', router);
app.listen(_PORT);
console.log("Server Started : ", _PORT);
