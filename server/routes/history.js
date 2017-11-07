var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var mysql = require('mysql');
var databaseConnection = require('./database');
var appLogger=require('../custom_utils/appLogger');

app.use(express.static('/'));
app.use(express.static('dist'));
app.use('/*', express.static(path.resolve('dist')));

router.get('/', function (req, res) {
  console.log("Get History");
  var jwtToken= req.headers.authorization;
  console.log("Get History");
  var userName=req.headers.username;
  console.log("Query ", req.headers.authorization, " | ", req.headers.username);
  var query = "select User_Id from users WHERE JwtToken='"+jwtToken+"' and username='"+userName+"'";
  console.log("Query ", query);
  databaseConnection.query(query,function(error, dbRecordset, fields){
    if(error) {
      res.status(500);
      res.send({
        "code":500,
        "status":"Internal Server Error"
          });
      }else{
        console.log("New Results : ", dbRecordset);
        if(dbRecordset.length>0){
        var query="SELECT * FROM search_history";
        databaseConnection.query(query,function(error, dbRecordset, fields){
          if(error) {
            res.status(500);
            res.send({
              "code":500,
              "status":"Internal Server Error"
                });
            }else{
              appLogger.logger.info(dbRecordset);
              res.status(200);
              res.send({
                "code":200,
                "status":"Success",
                "result":dbRecordset
                });
            }
          });
        }else{
          res.sendStatus(401);
        }
      }
  });
});

router.get('/results', function (req, res) {
  console.log("Get History/Results");
  var jwtToken= req.headers.authorization;
  console.log("Get History/Results");
  var userName=req.headers.username;
  console.log("Query ", req.headers.authorization, " | ", req.headers.username);
  var query = "select User_Id from users WHERE JwtToken='"+jwtToken+"' and username='"+userName+"'";
  console.log("Query ", query);
  databaseConnection.query(query,function(error, dbRecordset, fields){
    if(error) {
      res.status(500);
      res.send({
        "code":500,
        "status":"Internal Server Error"
          });
      }else{
        console.log("New Results : ", dbRecordset);
        if(dbRecordset.length>0){
            var selectQuery="SELECT * FROM search_results WHERE search_location= '"+req.query.location+"' and industry='"+req.query.industry+"'";
            appLogger.logger.info('query', selectQuery);
            databaseConnection.query(selectQuery,function(error, dbRecordset, fields){
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
                "result":dbRecordset
                  });
            }
          });
        }else{
          res.sendStatus(401);
        }
      }
  });
});

router.get('/location', function (req, res) {
  console.log("Get History/Location");
  var jwtToken= req.headers.authorization;
  console.log("Get History/Location");
  var userName=req.headers.username;
  console.log("Query ", req.headers.authorization, " | ", req.headers.username);
  var query = "select User_Id from users WHERE JwtToken='"+jwtToken+"' and username='"+userName+"'";
  console.log("Query ", query);
  databaseConnection.query(query,function(error, dbRecordset, fields){
    if(error) {
      res.status(500);
      res.send({
        "code":500,
        "status":"Internal Server Error"
          });
      }else{
        console.log("New Results : ", dbRecordset);
        if(dbRecordset.length>0){
            var industry= req.query.industry;
            appLogger.logger.info(industry);
            var query="SELECT DISTINCT(location) AS search_location FROM search_history WHERE industry='"+industry+"'";
            databaseConnection.query(query,function(error, dbRecordset, fields){
              console.log('DBRecords : ',dbRecordset);
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
                    "result":dbRecordset
                    });
                }
            });


        }else{
          res.sendStatus(401);
        }
      }
  });
  
  });



  router.get('/export', function (req, res) {
    console.log("Get History/export");
    var jwtToken= req.headers.authorization;
    console.log("Get History/export");
    var userName=req.headers.username;
    console.log("Query ", req.headers.authorization, " | ", req.headers.username);
    var query = "select User_Id from users WHERE JwtToken='"+jwtToken+"' and username='"+userName+"'";
    console.log("Query ", query);
    databaseConnection.query(query,function(error, dbRecordset, fields){
      if(error) {
        res.status(500);
        res.send({
          "code":500,
          "status":"Internal Server Error"
            });
        }else{
          console.log("New Results : ", dbRecordset);
          if(dbRecordset.length>0){
              var format= req.query.format;
              var industry= req.query.industry;
              var location= req.query.location;
              appLogger.logger.info('format requested',format);
              var query="SELECT DISTINCT(location) AS search_location FROM search_history WHERE industry='"+industry+"'";
              databaseConnection.query(query,function(error, dbRecordset, fields){
              console.log('DBRecords : ',dbRecordset);
              if(error) {
                  res.status(500);
                  res.send({
                  "code":500,
                  "Failure":"Internal Server Error"
                      });
                  }else{
                  appLogger.logger.info(dbRecordset);
                  res.status(200);
                  res.send({
                      "code":200,
                      "success":"Records from db",
                      "result":dbRecordset
                      });
                  } 
              });
  
          }else{
            res.sendStatus(401);
          }
        }
    });

  });




  module.exports = router;
