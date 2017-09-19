var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var search = require('./Scrapingroutes');

app.use(express.static('/'));
app.use(express.static('dist'));
app.use('/*', express.static(path.resolve('dist')));

router.get('/', function (req, res) {
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
});





//old code
// searchyelp = function(req,res){
// var searchId=0;
//   connection.query('SELECT searchId FROM searchhistory ORDER BY searchId DESC LIMIT 1 ',function (error, result, fields){
//   if(error) {
//     console.log("error ocurred",error);
//     }else{
//       searchId=result[0].searchId + 1;
//     }
//   });
//   console.log("req",req.query);
//   var values=[];
//   var jsonvalues=[];
//   var today = new Date();
//   var industry = req.query.industry.replace(/ /g,'%20');
//   var location = req.query.location.replace(/ /g,'%20');//"Test%20-%20Text"
//   var url='https://www.yelp.com/search?find_desc='+industry+'&find_loc='+location;
//   var search={
//     "location":req.query.location,
//     "industry":req.query.industry,
//     "date":today,
//     "SearchDir":'Yelp'
//   };
//   connection.query('INSERT INTO searchhistory SET ?',search, function (error, scrapes, fields) {
//   if(error) {
//     console.log("error ocurred",error);
//     res.send({
//       "code":400,
//       "failed":"error ocurred"
//     });
//   }else{
//     console.log('Entry made into search history');
//   }
//   });
//   x(url, 'div.search-result', [{
//   Name:'a.biz-name.js-analytics-click',
//   address: 'address',
//   phone: 'span.biz-phone'
//   }])(function(err, results){
//   for(var i=0; i< results.length; i++){

//   // values.push([results[i].Name,results[i].address, results[i].phone]);
//   var add= results[i].address.replace(/\n        |\n    /g,'');
//   var phn= results[i].phone.replace(/\n        |\n    /g,'');
//   // var web='https://www..com';
//   values.push([results[i].Name,add,phn,url,searchId]);
//   jsonvalues.push({"Name":results[i].Name,"address":add,"phone":phn});
//   }console.log('values', values);
//   console.log('json', jsonvalues);
//   connection.query('INSERT INTO Results (Name, address, phone,website,SearchId) VALUES ?', [values], function(err,result) {
//     if(err) {
//        console.log('DB Error');
//      }
//     else {
//        console.log('Success');
//      }
//     });
//     res.send({
//     "code":200,
//     "success":"entry made successfully",
//     "result":jsonvalues,
//     "url": url
//       });
//     });
// };

// searchyp = function(req,res){
//   var searchId=0;
//     connection.query('SELECT searchId FROM searchhistory ORDER BY searchId DESC LIMIT 1 ',function (error, result, fields){
//     if(error) {
//       console.log("error ocurred",error);
//       }else{
//         searchId=result[0].searchId + 1;
//       }
//     });
//   var values=[];
//   var jsonvalues=[];
//   var today = new Date();
//   var industry = req.query.industry.replace(/ /g,'+');
//   var location = req.query.location.replace(/ /g,'+');//"Test%20-%20Text"
//   var url='https://www.yellowpages.com/search?search_terms='+industry+'&geo_location_terms='+location;
//   var search={
//     "location":req.query.location,
//     "industry":req.query.industry,
//     "date":today,
//     "SearchDir":'Yellow Pages'
//   };
//   connection.query('INSERT INTO searchhistory SET ?',search, function (error, scrapes, fields) {
//   if(error) {
//     console.log("error ocurred",error);
//     res.send({
//       "code":400,
//       "failed":"error ocurred"
//     });
//   }else{
//     console.log('Entry made into search history');
//   }
//   });
//   x(url, 'div.v-card', [{
//   Name:'a.business-name',
//   address: 'p.adr',
//   phone: 'li.phone.primary',
//   website:'a@href'
//   }])(function(err, results){
//     console.log(results);
//   for(var i=0; i< results.length; i++){
//   // values.push([results[i].Name,results[i].address, results[i].phone]);
//   // var add= results[i].address.replace(/\n        |\n    /g,'');
//   // var phn= results[i].phone.replace(/\n        |\n    /g,'');
//   values.push([results[i].Name,results[i].address,results[i].phone,results[i].website,searchId]);
//   jsonvalues.push({"Name":results[i].Name,"address":results[i].address,"phone":results[i].phone,"website":results[i].website, "search ID":searchId});
//   }
//   // console.log('values', values);
//   console.log('json', jsonvalues);
//   connection.query('INSERT INTO Results (Name, address, phone, website,SearchId) VALUES ?', [values], function(err,result) {
//     if(err) {
//        console.log('DB Error');

//      }
//     else {
//        console.log('Success');
//      }
//     });
//     res.send({
//     "code":200,
//     "success":"entry made successfully",
//     "result":jsonvalues,
//     "url": url
//       });
//     });
// };
// searchmanta = function(req,res){
//   var searchId=0;
//     connection.query('SELECT searchId FROM searchhistory ORDER BY searchId DESC LIMIT 1 ',function (error, result, fields){
//     if(error) {
//       console.log("error ocurred",error);
//       }else{
//         searchId=result[0].searchId + 1;
//       }
//     });
//   var values=[];
//   var jsonvalues=[];
//   var today = new Date();
//   var industry = req.query.industry.replace(/ /g,'+');
//   var location = req.query.location.replace(/ /g,'+');//"Test%20-%20Text"
//   var url='https://www.manta.com/search?search_source=business&search='+industry+'&search_location='+location+'&pt=';
//   // var url='https://www.yellowpages.com/search?search_terms='+industry+'&geo_location_terms='+location;
//   var search={
//     "location":req.query.location,
//     "industry":req.query.industry,
//     "date":today,
//     "SearchDir":'Manta'
//   };
//   connection.query('INSERT INTO searchhistory SET ?',search, function (error, scrapes, fields) {
//   if(error) {
//     console.log("error ocurred",error);
//     res.send({
//       "code":400,
//       "failed":"error ocurred"
//     });
//   }else{
//     console.log('Entry made into search history');
//   }
//   });
//   x(url, 'li.list-group-item', [{
//   Name:'strong',
//   address: 'div.mvm mhn',
//   phone: 'div.hidden-device-xs'
//   }])(function(err, results){
//     console.log(results);
//   for(var i=0; i< results.length; i++){
//   // values.push([results[i].Name,results[i].address, results[i].phone]);
//   // var add= results[i].address.replace(/\n        |\n    /g,'');
//   // var phn= results[i].phone.replace(/\n        |\n    /g,'');
//   values.push([results[i].Name,results[i].address,results[i].phone,results[i].website,searchId]);
//   jsonvalues.push({"Name":results[i].Name,"address":results[i].address,"phone":results[i].phone,"website":results[i].website, "search ID":searchId});
//   }
//   // console.log('values', values);
//   console.log('json', jsonvalues);
//   connection.query('INSERT INTO Results (Name, address, phone, website,SearchId) VALUES ?', [values], function(err,result) {
//     if(err) {
//        console.log('DB Error');

//      }
//     else {
//        console.log('Success');
//      }
//     });
//     res.send({
//     "code":200,
//     "success":"entry made successfully",
//     "result":jsonvalues,
//     "url": url
//       });
//     });
// };
module.exports = router;