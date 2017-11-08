var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var search = require('./scraperoutes');
var appLogger=require('../custom_utils/appLogger');
app.use(express.static('/'));
app.use(express.static('dist'));
app.use('/*', express.static(path.resolve('dist')));

router.get('/', function (req, res) {
  // console.log(req.query);
  var directory= req.query.directory;
  console.log("Get Search");
  var jwtToken= req.headers.authorization;
  var userName=req.headers.username;
  console.log("Query ", req.headers.authorization, " | ", crypt.decodeJWT(jwtToken).username);
  var query = "select User_Id from users WHERE JwtToken='"+jwtToken+"' and username='"+crypt.decodeJWT(jwtToken).username+"'";
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
          scraper.search(req, res);
        }else{
          res.sendStatus(401);
        }

      }
  });

  // switch(directory){
  //   case "yelp":
  //     search.searchYelp(req, res);
  //     break;
  //   case "yp":
  //     search.searchyp(req, res);
  //     break;
  //   case "manta":
  //     search.searchmanta(req, res);
  //     break;
  // }
});

module.exports = router;
