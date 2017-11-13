var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var mysql = require('mysql');
var databaseConnection = require('./database');
var appLogger=require('../custom_utils/appLogger');
var crypt = require('../custom_utils/crypt');

app.use(express.static('/'));
app.use(express.static('dist'));
app.use('/*', express.static(path.resolve('dist')));


router.post('/', function (req, res, body) {
  if (req.body.password.length == 0 || req.body.username.length == 0){
    res.sendStatus(400);
    return;
  }
  console.log("POST Authenticate",  req.body.password);
  req.body.password = crypt.encrypt(req.body.password);
  console.log("Encrypted Body : ", req.body.password);
  appLogger.logger.info('Username : ', req.body.username, ' | Password : *  |  Role : ',  crypt.decodeJWT.role);
        var query="SELECT username, User_Id, firstname, lastname, type FROM users where username= '"+req.body.username+"' and password='"+req.body.password+"'";
        console.log(query);
        databaseConnection.query(query,function(error, dbRecordset, fields){
          console.log("Complete Recordset : ", dbRecordset);
          if(error) {
            res.status(500);
            res.send({
              "code":500,
              "status":"Internal Server Error"
                });
            }else{
              if(dbRecordset.length == 0){
                res.status(401);
                res.send({
                "code":401,
                "status":"Unauthorized Access",
                  });
                }else{
                  res.status(200);
                   var jwtToken = crypt.createJWT(dbRecordset[0].username, dbRecordset[0].User_Id, dbRecordset[0].type );
                  //JWT Token Save to Database against the User
                  databaseConnection.query("UPDATE list_builder.users SET JwtToken='"+jwtToken.token+"' Where User_Id="+dbRecordset[0].User_Id, function(error, dbRecordset){
                    if(error) {
                      res.status(500);
                      res.send({
                          "code":500,
                          "status":"Internal Server Error"
                          });
                      }else{
                        res.header("authorization", jwtToken.token);
                        res.status(200);
                        res.send({
                          "code":200,
                          "status":"Authorized Access"
                        });
                      }
                  });                    
                }
            }
          });
      });


  module.exports = router;
