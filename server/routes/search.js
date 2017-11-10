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
        if(dbRecordset.length == 0){          
          res.sendStatus(401);
        }else{
          appLogger.logger.info("Search : User Authorized -> Proceed to Scarape Routes");
          scraper.search(req, res);
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
