var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var databaseConnection = require('./database');
var appLogger=require('../custom_utils/appLogger');

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

router.delete('/', function (req, res) {
  var userId = req.query.userId;
        var query="delete FROM users where user_Id="+userId;
        databaseConnection.query(query,function(error, fields){
          appLogger.logger.info('response from db',fields);
          if(error) {
            res.status(500);
            res.send({
              "code":500,
              "status":"Internal Server Error"
                });
              } else{
                res.status(204);
                res.send({
                  "code":204,
                  "status":"No Content"
                  });
              }
      });
});

router.put('/', function (req, res) {
    var values=[];
    values.push([req.body.firstname,req.body.lastname,req.body.username,req.body.password,req.body.type]);
    appLogger.logger.info('values',values);
    databaseConnection.query("SELECT * FROM users where username= '"+req.body.username+"'",function(error, results, fields){
      if(!error) {
          appLogger.logger.info('results',results);
            if(results.length==0){
              databaseConnection.query('INSERT INTO users (firstname, lastname, username, password, type) VALUES ?', [values],function(error, newresults){
                if(error) {
                res.status(500);
                res.send({
                    "code":500,
                    "status":"Internal Server Error"
                    });
                }else{
                    appLogger.logger.info("Send Status : ", newresults, "End");
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

router.post('/', function (req, res) {
  databaseConnection.query("SELECT * FROM users where user_Id= '"+req.body.userId+"'",function(error, results, fields){
    if(!error) {
        appLogger.logger.info('results',results);
          if(results.length==0){
            res.status(400);
            res.send({
              "code":400,
              "status":"User Doesn't exist"
                  });
          } else{
            databaseConnection.query("UPDATE list_builder.users SET firstname='"+req.body.firstname+"', lastname='"+req.body.lastname+"', username='"+req.body.username+"', type="+req.body.type+" Where user_Id="+req.body.userId, function(error, newresults){
              if(error) {
              res.status(500);
              res.send({
                  "code":500,
                  "status":"Internal Server Error"
                  });
              }else{
                  appLogger.logger.info("Send Status : ", newresults, "End");
                  res.status(200);
                  res.send({
                  "code":200,
                  "status":"Successfully updated"
                  });
              }
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
