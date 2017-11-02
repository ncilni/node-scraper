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
router.post('/upload', function(req, res){
    console.log('post request');
    res.send({origImage:'https://celebstyle.s3.amazonaws.com/uploads/k.jpg',
              images:'https://n2.sdlcdn.com/imgs/f/g/1/Active-Feel-Free-Life-Beige-SDL937709718-1-cda95.jpg,https://n1.sdlcdn.com/imgs/d/0/2/Jaipur-Attire-Beige-Cotton-Straight-SDL936580183-1-9e730.jpg,https://n2.sdlcdn.com/imgs/b/x/z/VR-Fashion-Multicoloured-Cotton-Anarkali-SDL937037647-1-9dfaa.jpg,https://n4.sdlcdn.com/imgs/f/x/o/W-White-Cotton-Straight-Kurti-SDL057524412-1-56367.jpg,https://n1.sdlcdn.com/imgs/b/c/1/Meher-Impex-Multi-Cotton-Kurti-SDL411587964-1-e8a29.jpg,https://n3.sdlcdn.com/imgs/f/y/y/Shree-Beige-Cotton-A-line-SDL375192410-1-d188c.jpg,https://n1.sdlcdn.com/imgs/f/n/i/Gktrendz-Red-Cotton-Printed-Unstitched-SDL518588724-1-e31e1.jpg,https://n1.sdlcdn.com/imgs/b/4/e/Varsha-Beige-Crepe-Straight-Unstitched-SDL172718731-1-b9f1f.jpg,https://n3.sdlcdn.com/imgs/c/k/1/Ziyaa-Multicoloured-Crepe-Straight-Kurti-SDL128585797-1-5bace.jpg,https://n4.sdlcdn.com/imgs/a/6/z/Nakoda-Creation-Multi-Color-Cotton-SDL552888544-1-bd211.jpg,https://n3.sdlcdn.com/imgs/e/b/q/Ziyaa-Peach-Crepe-Straight-Kurti-SDL292427673-1-e6d3d.jpg,https://n1.sdlcdn.com/imgs/b/e/h/Yepme-Sarikka-Red-and-White-SDL180225236-1-55594.jpg,https://n2.sdlcdn.com/imgs/e/e/w/Ziyaa-Multicoloured-Crepe-Straight-Kurti-SDL736345677-1-f16c3.jpg,https://n4.sdlcdn.com/imgs/d/j/g/W-Multicoloured-Rayon-Straight-Kurti-SDL711966210-1-27162.jpg,https://n1.sdlcdn.com/imgs/d/9/0/Shivanya-Fashion-Off-White-Cotton-SDL513337605-1-b8fcc.jpg,https://n3.sdlcdn.com/imgs/d/m/b/Style-N-Shades-Multicoloured-Rayon-SDL804631577-1-2d9c1.jpg,https://n1.sdlcdn.com/imgs/a/t/n/Shree-Ganesh-Cotton-Printed-Dress-SDL175374342-1-bdc24.jpg,https://n4.sdlcdn.com/imgs/d/m/b/Style-N-Shades-Beige-Rayon-SDL044846720-1-a1f8f.jpg,https://n3.sdlcdn.com/imgs/f/w/7/8907496012963_M_1_3x-8185c.jpg,https://n3.sdlcdn.com/imgs/d/p/x/Active-Beige-Net-Circular-Semi-SDL221345622-1-c4c75.jpg',
              categories: 'Saree',
              categoriesLength: 20});
          });
          
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
