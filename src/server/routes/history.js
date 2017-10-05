var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var mysql = require('mysql');

app.use(express.static('/'));
app.use(express.static('dist'));
app.use('/*', express.static(path.resolve('dist')));

var connection = mysql.createConnection({
    host     : 'mysql.intelegencia.com',
    user     : 'user_listbuilder',
    password : 'intel@01',
    database : 'list_builder'
  });
  connection.connect(function(err){
  if(!err) {
    //   console.log("Database is connected ... nn");
  } else {
      console.log("Error connecting database ... nn");
  }
  });
  

router.get('/', function (req, res) {
        var query="SELECT * FROM search_history";
        connection.query(query,function(error, newresults, fields){
          if(error) {
            res.send({
              "code":500,
              "Failure":"Internal Server Error"
                });
            }else{
              res.send({
                "code":200,
                "success":"Records from db",
                "result":newresults
                  });
            }
          });              
      });
  
  module.exports = router;