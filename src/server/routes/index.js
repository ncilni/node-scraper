var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var search = require('./Scrapingroutes');

app.use(express.static('/'));
app.use(express.static('dist'));
app.use('/*', express.static(path.resolve('dist')));

/* Test route */
router.get('/', function (req, res) {
    res.send('Requests to server are OK');
});

router.get('/search', function(req, res){
    console.log(req.query);
    var directory= req.query.directory;
    switch(directory){
      case "yelp": 
        search.searchyelp(req, res);
        break;
      case "yp":
        search.searchyp(req, res);
        break;
      case "manta":
        search.searchmanta(req, res);
        break;
    }
    console.log(req.body.location);
    search.searchyelp(req, res)
  
  });

// router.get('/', function(req, res) {
//     res.json({ message: 'welcome to our scraper api' });
// });
// //route to handle user registration
// router.get('/search', function(req, res){
//   console.log(req);
//   search.searchyelp(req, res)

// });
// router.post('/searchyp', function(req, res){
//   console.log(req.body.location);
//   search.searchyp(req, res)

// });
// router.post('/searchmanta', function(req, res){
//   console.log(req.body.location);
//   search.searchmanta(req, res)

// });

module.exports = router;