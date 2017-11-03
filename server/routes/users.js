var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var databaseConnection = require('./database');


app.use(express.static('/'));
app.use(express.static('dist'));
app.use('/*', express.static(path.resolve('dist')));

router.get('/', function (req, res) {
  var listQuery = req.query.list;
  if (listQuery=='all'){
        var query="SELECT User_Id, firstname, lastname, username, type FROM users";
        databaseConnection.query(query,function(error, newresults, fields){
          if(error) {
            res.status(500);
            res.send({
              "code":500,
              "status":"Internal Server Error"
                });
            }else{
              res.status(200);
              res.send({
                "code":200,
                "status":"Success",
                "result":newresults
                });
            }
          });
        }else{
          var query="SELECT User_Id, firstname, lastname, username, type FROM users Where User_Id="+listQuery;
          databaseConnection.query(query,function(error, newresults, fields){
            if(error) {
              res.status(500);
              res.send({
                "code":500,
                "status":"Internal Server Error"
                  });
              }else{
                if(newresults.length==0){
                  res.status(400);
                  res.send({
                    "code":400,
                    "status":"Bad request ",
                    "message": "User Does not Exist"
                    });
                }else{
                  res.status(200);
                  res.send({
                    "code":200,
                    "status":"Success",
                    "result":newresults
                    });
                }
              
              }
            });
        }              
      });
  
  module.exports = router;