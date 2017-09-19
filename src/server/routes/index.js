var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');

app.use(express.static('/'));
app.use(express.static('dist'));
app.use('/*', express.static(path.resolve('dist')));

/* Test route */
router.get('/', function (req, res) {
    res.send('Requests to server are OK');
});

module.exports = router;