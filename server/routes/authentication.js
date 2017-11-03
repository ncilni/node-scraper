var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var mysql = require('mysql');
var databaseConnection = require('./database');

app.use(express.static('/'));
app.use(express.static('dist'));
app.use('/*', express.static(path.resolve('dist')));


router.post('/', function (req, res,body) {
  console.log('user headers', req.headers);
  //passkey = window.atob(req.body.password);
  console.log(req.body, 'passkey');
        var query="SELECT username, User_Id, firstname, lastname, type FROM users where username= '"+req.body.username+"' and password='"+req.body.password+"'";
        databaseConnection.query(query,function(error, results, fields){
          if(error) {
            res.status(500);
            res.send({
              "code":500,
              "status":"Internal Server Error"
                });
            }else{
              if(results.length==0){
                res.status(401);
                res.send({
                "code":401,
                "status":"Unauthorized Access",
                  });  
                }else{
                  res.status(200);
                  res.send({
                  "code":200,
                  "status":"User Authorized",
                  "result":results
                    }); 
                }            
            }
          });              
      });


  module.exports = router;
