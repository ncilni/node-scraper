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
  

router.post('/', function (req, res,body) {
  console.log('user headers', req.headers);
  //passkey = window.atob(req.body.password);
  console.log(req.body, 'passkey');
        var query="SELECT username, User_Id, firstname, lastname, type FROM users where username= '"+req.body.username+"' and password='"+req.body.password+"'";
        connection.query(query,function(error, results, fields){
          if(error) {
            res.sendStatus(500);
            res.send({
              "code":500,
              "Failure":"Internal Server Error"
                });
            }else{
              if(results.length==0){
                console.log('result',results);
                res.sendStatus(404);
                res.send({
                "code":404,
                "message":"User Doesn't exist",
                  });  
                }else{
                  console.log(results);
                  res.sendStatus(200);
                  res.send({
                  "code":200,
                  "message":"User retrieved",
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
    connection.query("SELECT * FROM users where username= '"+req.body.username+"'",function(error, results, fields){
      if(error) {
        res.sendStatus(500);
        res.send({
          "code":500,
          "Failure":"Internal Server Error"
            });
        }else{
          console.log('results',results);
            if(results.length==0){
              connection.query('INSERT INTO users (firstname, lastname, username, password, type) VALUES ?', [values],function(error, newresults){
                if(error) {
                res.sendStatus(500);
                res.send({
                    "code":500,
                    "Failure":"Internal Server Error"   
                    });
                }else{
                    console.log(newresults);
                    res.sendStatus(200);
                    res.send({
                    "code":200,
                    "message":"User Created"
                        });
                }
            });   
            } else{
              res.sendStatus(422);
              res.send({
                "code":422,
                "message":"Username already exists"
                    });
            }      
        }
      });              


          
});

  module.exports = router;
