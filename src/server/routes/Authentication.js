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
  console.log('user headers', req.headers);
  console.log(req.headers.username);
        var query="SELECT * FROM users where username= '"+req.headers.username+"' and password='"+req.headers.password+"'";
        connection.query(query,function(error, results, fields){
          if(error) {
            res.send({
              "code":500,
              "Failure":"Internal Server Error"
                });
            }else{
              if(results.length==0){
                console.log('result',results);
                res.send({
                "code":205,
                "message":"User Doesn't exist",
                  });  
                }else{
                  console.log(results);
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
        res.send({
          "code":500,
          "Failure":"Internal Server Error"
            });
        }else{
          console.log('results',results);
            if(results.length==0){
              connection.query('INSERT INTO users (firstname, lastname, username, password, type) VALUES ?', [values],function(error, newresults){
                if(error) {
                res.send({
                    "code":500,
                    "Failure":"Internal Server Error"   
                    });
                }else{
                    console.log(newresults);
                    res.send({
                    "code":200,
                    "message":"User Created"
                        });
                }
            });   
            } else{
              res.send({
                "code":205,
                "message":"Username already exists"
                    });
            }      
        }
      });              


          
});

  module.exports = router;