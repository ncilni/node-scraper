var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var search = require('./scraperoutes');

app.use(express.static('/'));
app.use(express.static('dist'));
app.use('/*', express.static(path.resolve('dist')));

router.get('/', function (req, res) {
  // console.log(req.query);
  var directory= req.query.directory;
  Promise.all([search.searchYelp(req, res), search.searchyp(req, res),search.searchmanta(req, res)])
  .then(function(allData) {
      // All data available here in the order it was called.
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
