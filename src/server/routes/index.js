var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var Xray = require('x-ray');
var x = Xray();
var async = require('async');
var Step= require('step');
app.use(express.static('/'));
app.use(express.static('dist'));
app.use('/*', express.static(path.resolve('dist')));

/* Test route */
router.get('/', function (req, res) {
   var url= 'https://www.manta.com/search?search_source=business&search=doctor&search_location=New+York+NY&pt=40.7528%2C-73.9725';
   console.log('get request made');
    // x(url,'title')(function(err, result) {
    //     console.log('first url',result) // Google 
    // }(function(){
    //     res.send('Requests to server are OK');
    // }));
    // var url2='http://ec2-13-126-68-17.ap-south-1.compute.amazonaws.com/men/bath-and-body/sun-care-and-tanning.html';
    // x(url2,'title')(function(err, result) {
    //     console.log('second url',result)    
    // Step(
    //     function loapage() {
    //         x(url,'title')(function(err, result) {
    //             console.log('first url',result);
                
    //             res.send('Requests to server are OK');
    //         });
    //        console.log('exit the scraper');
    //     },
    //     function second() {
    //         console.log('in the second loop');
    //         // res.send('Requests to server are OK');
    //     }
    //   );
    // async.series([
    //     // check if async.txt exists
    //     function(cb) {
    //         x(url,'title')(function(err, result) {
    //             console.log('first url',result);
    //         });
    //     },
    //     function(cb) {
    //         console.log('in the second loop');
    //         res.send('Requests to server are OK');
    //     }
    // ]);

    request(url, function(err, resp, body){
        if(err){
            console.log('there was an error');
        }else{
            console.log(body);
        }
    });

});
// });
module.exports = router;
