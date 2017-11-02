var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var search = require('./ScrapeRoutes');

app.use(express.static('/'));
app.use(express.static('dist'));
app.use('/*', express.static(path.resolve('dist')));

router.get('/', function (req, res) {
  // console.log(req.query);
  var directory= req.query.directory;
  switch(directory){
    case "yelp": 
      search.searchYelp(req, res);
      break;
    case "yp":
      search.searchyp(req, res);
      break;
    case "manta":
      search.searchmanta(req, res);
      break;
  }
});

module.exports = router;