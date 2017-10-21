var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var mysql = require('mysql');
var download = require('./Downloadroutes');

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
              console.log(newresults);
              res.send({
                "code":200,
                "success":"Records from db",
                "result":newresults
                  });
            }
          });              
      });

router.get('/download', function (req, res) {
  var format= req.query.format;
  console.log('inside download api');
  switch(format){
    case "csv": 
      download.csv(req, res);
      break;
    case "xsl":
      download.xls(req, res);
      break;
    case "pdf":
      download.pdf(req, res);
      break;
  }           
});


router.get('/results', function (req, res) {
  var query="SELECT * FROM search_results WHERE search_location= '"+req.query.location+"' and industry='"+req.query.industry+"'";
  console.log('query', query);
  connection.query(query,function(error, newresults, fields){
    if(error) {
      res.send({
        "code":500,
        "Failure":"Internal Server Error"
          });
      }else{
        // console.log(newresults);
        res.send({
          "code":200,
          "success":"Records from db",
          "result":newresults
            });
      }
    });              
});



  router.get('/location', function (req, res) {
    var industry= req.query.industry;
    console.log(industry);
    var query="SELECT DISTINCT(location) AS search_location FROM search_history WHERE industry='"+industry+"'";
    connection.query(query,function(error, newresults, fields){
      if(error) {
        res.send({
          "code":500,
          "Failure":"Internal Server Error"
            });
        }else{
          console.log(newresults);
          res.send({
            "code":200,
            "success":"Records from db",
            "result":newresults
              });
        }
      });              
  });



  // router.get('/export', function (req, res) {
  //   var format= req.query.format;
  //   var industry= req.query.industry;
  //   var location= req.query.location;
  //   console.log('format requested',format);
  //   var query="SELECT DISTINCT(location) AS search_location FROM search_history WHERE industry='"+industry+"'";
  //   connection.query(query,function(error, newresults, fields){
  //     if(error) {
  //       res.send({
  //         "code":500,
  //         "Failure":"Internal Server Error"
  //           });
  //       }else{
  //         console.log(newresults);
  //         res.send({
  //           "code":200,
  //           "success":"Records from db",
  //           "result":newresults
  //             });
  //       }
  //     });              
  // });



  
  module.exports = router;