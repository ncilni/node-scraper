var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var mysql = require('mysql');


app.use(express.static('/'));
app.use(express.static('dist'));
app.use('/*', express.static(path.resolve('dist')));

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
                console.log('result : ',results);
                res.status(401);
                res.send({
                "code":401,
                "status":"Unauthorized Access",
                  });  
                }else{
                  console.log(results);
                  res.sendStatus(200);
                  res.send({
                  "code":200,
                  "status":"User Authorized",
                  "result":results
                    }); 
                }            
            }
          });              
      });

router.post('/register', function (req, res) {

    var values=[];
    values.push([req.body.firstname,req.body.lastname,req.body.username,req.body.password,req.body.type]);
    console.log('values',values);
    databaseConnection.query("SELECT * FROM users where username= '"+req.body.username+"'",function(error, results, fields){
      if(!error) {
          console.log('results',results);
            if(results.length==0){
              databaseConnection.query('INSERT INTO users (firstname, lastname, username, password, type) VALUES ?', [values],function(error, newresults){
                if(error) {
                res.status(500);
                res.send({
                    "code":500,
                    "status":"Internal Server Error"   
                    });
                }else{
                    console.log("Send Status : ", newresults, "End");
                    res.status(201);
                    res.send({
                    "code":201,
                    "status":"User Created"
                    });
                }
            });   
            } else{
              res.status(400);
              res.send({
                "code":400,
                "status":"User already exists"
                    });
            }      
        }
        else{
          res.status(500);
          res.send({
            "code":500,
            "status":"Internal Server Error"
          });
        }
      });              
   });

  module.exports = router;
