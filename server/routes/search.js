var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var scraper = require('./scraperoutes');
var appLogger=require('../custom_utils/appLogger');
app.use(express.static('/'));
app.use(express.static('dist'));
app.use('/*', express.static(path.resolve('dist')));
var databaseConnection = require('./database');
var crypt = require('../custom_utils/crypt');

router.get('/', function (req, res) {
  // console.log(req.query);
  console.log("Get Search");
  var jwtToken= req.headers.authorization;
  console.log("Query ", req.headers.authorization, " | ", crypt.decodeJWT(jwtToken).username);
  var query = "select User_Id from users WHERE JwtToken='"+jwtToken+"' and username='"+crypt.decodeJWT(jwtToken).username+"'";
  console.log("Query ", query);
  databaseConnection.query(query,function(error, dbRecordset, fields){
    if(error) {
      res.status(500);
      res.send({
        "code":500,
        "status":"Search : Internal Server Error"
          });
      }else{
        console.log("New Results : ", dbRecordset);
        if(dbRecordset.length>0){
          scraper.search(req, res).then(
            function(req, res) {
              var query="SELECT * FROM search_results WHERE search_location= '"+req.query.location+" AND industry='"+req.query.industry+"'";
              databaseConnection.query(query,function(error, dbRecordset, fields){
                if(error) {
                  res.status(500);
                  }else{
                    appLogger.logger.info(dbRecordset);
                    res.status(200);
                    res.send({
                      "result":dbRecordset
                      });
                  }
                });
            }
          )
        }else{
          res.sendStatus(401);
        }       
      }
  });
});

module.exports = router;
