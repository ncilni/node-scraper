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
                res.status(200);
                res.send({
                  "code":200,
                  "status":"Success",
                  "result":newresults
                  });
              }
            });
        }              
      });

router.get('/results', function (req, res) {
  var query="SELECT * FROM search_results WHERE search_location= '"+req.query.location+"' and industry='"+req.query.industry+"'";
  console.log('query', query);
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
});
router.get('/location', function (req, res) {
    var industry= req.query.industry;
    console.log(industry);
    var query="SELECT DISTINCT(location) AS search_location FROM search_history WHERE industry='"+industry+"'";
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
  });



  router.get('/export', function (req, res) {
    var format= req.query.format;
    var industry= req.query.industry;
    var location= req.query.location;
    console.log('format requested',format);
    var query="SELECT DISTINCT(location) AS search_location FROM search_history WHERE industry='"+industry+"'";
    databaseConnection.query(query,function(error, newresults, fields){
      if(error) {
        res.status(500);
        res.send({
          "code":500,
          "Failure":"Internal Server Error"
            });
        }else{
          console.log(newresults);
          res.status(200);
          res.send({
            "code":200,
            "success":"Records from db",
            "result":newresults
              });
        }
      });              
  });



  
  module.exports = router;