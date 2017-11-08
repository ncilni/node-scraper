var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var Xray = require('x-ray');
var x = Xray();
var databaseConnection = require('./database');
var appLogger=require('../custom_utils/appLogger');

function scrapeYelp(query){
      var industry = query.industry.replace(/ /g,'+');
      var location = query.location.replace(/ /g,'+');
      var page=query.page;
      var start=(page-1)*10;
      var values=[];
      var today = new Date();
      var url='https://www.yelp.com/search?find_desc='+industry+'&find_loc='+location+'&start='+start;
      appLogger.logger.info('url to scrape:', url);
      x(url, 'div.search-result', [{
        business_name:'a.biz-name.js-analytics-click',
        address: 'address',
        phone: 'span.biz-phone'
        }])(function(err, results){
        for(var i=0; i< results.length; i++){
          var add= results[i].address.replace(/\n        |\n    /g,'');
          var address= add +" ";
          var phn= results[i].phone.replace(/\n        |\n    /g,'');
          values.push([results[i].business_name,address,phn,url,query.location,query.industry]);
            }
        setTimeout(function(){
          databaseConnection.query('INSERT INTO search_results (business_name, address, phone, website, search_location, industry) VALUES ?', [values], function(err,result) {
            if(err) {
                appLogger.logger.error('Database Error');
            }
            else {
                appLogger.logger.info('Successfully inserted scraped data to Database'," | ", "page",page);
            }
            });
  
        },4000);
        });
  
    }

function scrapeYp(query){
console.log('inside scrapeYp function');
    var industry = query.industry.replace(/ /g,'+');
    var location = query.location.replace(/ /g,'+');
    var page=query.page;
    var values=[];
    var today = new Date();
    var url='https://www.yellowpages.com/search?find_desc='+industry+'&find_loc='+location+'&page='+start;
    appLogger.logger.info('url to scrape:', url);
    x(url, 'div.v-card', [{
        business_name:'a.business-name',
        address: 'p.adr',
        phone: 'div.phone.primary',
        website:'a@href'
        }])(function(err, results){                
            for(var i=0; i< results.length; i++){
                var add= results[i].address+" ";
                values.push([results[i].business_name,add,results[i].phone,results[i].website,query.location,query.industry]);
            }
            setTimeout(function(){
                console.log(values);
                databaseConnection.query('INSERT INTO search_results (business_name, address, phone, website, search_location, industry) VALUES ?', [values], function(err,result) {
                if(err) {
                    appLogger.logger.error('Database Error');
                }
                else {
                    appLogger.logger.info('Successfully inserted scraped data to Database'," | ", "page",page);
                }
                });
            },5000);
        });       
    }

exports.search=function(req,res){
databaseConnection.query("SELECT searchId FROM search_history where location= '"+req.query.location+"' and industry='"+req.query.industry+"'",function (error, result, fields){
    if(error) {
        res.status(500);
        res.send({
          "code":500,
          "status":"Internal Server Error"
            });
       
        }
        else{
            console.log('results',result);
            if(result.length==0){
                var today = new Date();
                var searchQueries={
                    "location":req.query.location,
                    "industry":req.query.industry,
                    "search_directory":'Yelp',
                    "date":today
                    };
                databaseConnection.query('INSERT INTO search_history SET ?',searchQueries, function (error, scrapes, fields) {
                    if(error) {
                        res.status(500);
                        res.send({
                            "code":500,
                            "status":"Internal Server Error"
                            });
                    }else{
                    console.log('Entry made into search history');
                    }
                });
                var firstQuery={
                'industry':req.query.industry,
                'location': req.query.location,
                'page':1
                }
                scrapeYelp(firstQuery);
                scrapeYp(firstQuery);
                for (var i = 2; i <= 100; i++) {
                    (function (i) {
                        setTimeout(function () {
                        var query={
                                    'industry':req.query.industry,
                                    'location': req.query.location,
                                    'page':i
                                }
                        scrapeYelp(query);
                        scrapeYp(query);
                        }, 10000*i);
                        })(i);
                };
                }else{
                    var query="SELECT * FROM search_results WHERE searchId= '"+result[0].searchId+"'";
                    databaseConnection.query(query,function(error, newresults, fields){
                        if(error) {
                            res.status(500);
                            res.send({
                                "code":500,
                                "status":"Internal Server Error"
                                });
                            }else{
                                res.status(200);
                                res.send({
                                "result":newresults
                                });
                            }
                        });
                    }
                }
        });
    }





// var express = require('express');
// var router = express.Router();
// var app = express();
// var path = require('path');
// var Xray = require('x-ray');
// var x = Xray();
// var databaseConnection = require('./database');
// var appLogger=require('../custom_utils/appLogger');

// function scrapeYelp(query){
//   console.log('Scrape Yelp');
//     var industry = query.industry.replace(/ /g,'+');
//     var location = query.location.replace(/ /g,'+');
//     var page=query.page;
//     var start=(page-1)*10;
//     var values=[];
//     var jsonvalues=[];
//     var today = new Date();
//     var url='https://www.yelp.com/search?find_desc='+industry+'&find_loc='+location+'&start='+start;
//     appLogger.logger.info('page',page,'query:',query,'url:', url);
//     x(url, 'div.search-result', [{
//       business_name:'a.biz-name.js-analytics-click',
//       address: 'address',
//       phone: 'span.biz-phone'
//       }])(function(err, results){
//         appLogger.logger.info('scraped data', results)
//       for(var i=0; i< results.length; i++){
//         var add= results[i].address.replace(/\n        |\n    /g,'');
//         var address= add +" ";
//         var phn= results[i].phone.replace(/\n        |\n    /g,'');
//         values.push([results[i].business_name,address,phn,url,query.location,query.industry]);
//         jsonvalues.push({"business_name":results[i].business_name,"address":add,"phone":phn,"website":url, "industry":query.industry, "search_location":query.location });
//       }
//       setTimeout(function(){
//         appLogger.logger.info(values);
//         databaseConnection.query('INSERT INTO search_results (business_name, address, phone, website, search_location, industry) VALUES ?', [values], function(err,result) {
//           if(err) {
//             appLogger.logger.info('Database Error');
//           }
//           else {
//             appLogger.logger.info('Successfully inserted to Database');
//           }
//           });

//       },3000);
//       });

//   }

// function scrapeYp(query){
// appLogger.logger.info('inside scrapeYp function');
//     var industry = query.industry.replace(/ /g,'+');
//     var location = query.location.replace(/ /g,'+');
//     var page=query.page;
//     var values=[];
//     var jsonvalues=[];
//     var today = new Date();
//     var url='https://www.yellowpages.com/search?find_desc='+industry+'&find_loc='+location+'&start='+start;
//     appLogger.logger.info('page',page,'query:',query,'url:', url);
//     x(url, 'div.search-result', [{
//     business_name:'a.biz-name.js-analytics-click',
//     address: 'address',
//     phone: 'span.biz-phone'
//     }])(function(err, results){
//         appLogger.logger.info('scraped data', results)
//     for(var i=0; i< results.length; i++){
//         var add= results[i].address.replace(/\n        |\n    /g,'');
//         var address= add +" ";
//         var phn= results[i].phone.replace(/\n        |\n    /g,'');
//         values.push([results[i].business_name,address,phn,url,query.location,query.industry]);
//         jsonvalues.push({"business_name":results[i].business_name,"address":add,"phone":phn,"website":url, "industry":query.industry, "search_location":query.location });
//     }
//     setTimeout(function(){
//         appLogger.logger.info(values);
//         databaseConnection.query('INSERT INTO search_results (business_name, address, phone, website, search_location, industry) VALUES ?', [values], function(err,result) {
//         if(err) {
//             appLogger.logger.info('Database Error');
//         }
//         else {
//             appLogger.logger.info('Data Inserted');
//         }
//         });

//     },3000);
//     // console.log('values', values);
//     // console.log('json', jsonvalues);

//         });

// }

// function scrapeManta(query){
//     appLogger.logger.info('inside scrapeYp function');
//     var industry = query.industry.replace(/ /g,'+');
//     var location = query.location.replace(/ /g,'+');
//     var page=query.page;
//     var start=(page-1)*10;
//     var values=[];
//     var jsonvalues=[];
//     var today = new Date();
//     var url='https://www.yellowpages.com/search?find_desc='+industry+'&find_loc='+location+'&start='+start;
//   appLogger.logger.info('page',page,'query:',query,'url:', url);
//     x(url, 'div.search-result', [{
//         business_name:'a.biz-name.js-analytics-click',
//         address: 'address',
//         phone: 'span.biz-phone'
//         }])(function(err, results){
//         appLogger.logger.info('scraped data', results)
//         for(var i=0; i< results.length; i++){
//         var add= results[i].address.replace(/\n        |\n    /g,'');
//         var address= add +" ";
//         var phn= results[i].phone.replace(/\n        |\n    /g,'');
//         values.push([results[i].business_name,address,phn,url,query.location,query.industry]);
//         jsonvalues.push({"business_name":results[i].business_name,"address":add,"phone":phn,"website":url, "industry":query.industry, "search_location":query.location });
//         }
//         setTimeout(function(){
//         appLogger.logger.info(values);
//         databaseConnection.query('INSERT INTO search_results (business_name, address, phone, website, search_location, industry) VALUES ?', [values], function(err,result) {
//             if(err) {
//             appLogger.logger.info('DB Error');
//             }
//             else {
//             appLogger.logger.info('Successfully entered into the DB');
//             }
//             });

//         },3000);
//         // console.log('values', values);
//         // console.log('json', jsonvalues);

//         });

//     }

// exports.searchYelp=function(req,res){
//     console.log("inside searchYelp function");
//     databaseConnection.query("SELECT searchId FROM search_history where location= '"+req.query.location+"' and industry='"+req.query.industry+"'",function (error, result, fields){
//         if(error) {
//         res.send({
//             "code":500,
//             "Failure":"Internal Server Error"
//             });
//             }
//             else
//             appLogger.logger.info('results',result);
//             if(result.length==0){
//                 var values=[];
//                 var jsonvalues=[];
//                 var today = new Date();
//             //   var url='https://www.yelp.com/search?find_desc='+industry+'&find_loc='+location+'&start='+start;
//             //   console.log("url",url);
//                 var search={
//                 "location":req.query.location,
//                 "industry":req.query.industry,
//                 "search_directory":'Yelp',
//                 "date":today
//                 };
//                 databaseConnection.query('INSERT INTO search_history SET ?',search, function (error, scrapes, fields) {
//                 if(error) {
//                 appLogger.logger.info("error ocurred",error);
//                 res.send({
//                     "code":400,
//                     "failed":"error occurred while inserting into search history"
//                 });
//                 }else{
//                 appLogger.logger.info('Entry made into search history');
//                 }
//                 });
//                 var firstQuery={
//                 'industry':req.query.industry,
//                 'location': req.query.location,
//                 'page':1
//                 }
//                 scrapeYelp(firstQuery);
//                 for (var i = 2; i <= 100; i++) {
//                 (function (i) {
//                     setTimeout(function () {
//                     var query={
//                                 'industry':req.query.industry,
//                                 'location': req.query.location,
//                                 'page':i
//                             }
//                     scrapeYelp(query);
//                     }, 10000*i);
//                     })(i);
//                 };
//                 }else{
//                 var query="SELECT * FROM search_results WHERE searchId= '"+result[0].searchId+"'";
//                 databaseConnection.query(query,function(error, newresults, fields){
//                     if(error) {
//                     res.send({
//                         "code":500,
//                         "Failure":"Internal Server Error"
//                         });
//                     }else{
//                         res.send({
//                         "code":200,
//                         "success":"Records from db",
//                         "result":newresults,
//                         "url": "url"
//                             });
//                     }
//                     });
//                 }
//             });
//         }

// exports.searchYp=function(req,res){
//     // var start=(page-1)*10;

//     databaseConnection.query("SELECT searchId FROM search_history where location= '"+req.query.location+"' and industry='"+req.query.industry+"'",function (error, result, fields){
//     if(error) {
//         res.status(500);
//         res.send({
//           "code":500,
//           "status":"Internal Server Error"
//             });
//         }
//         else
//             appLogger.logger.info('results',result);
//             if(result.length==0){
//             var values=[];
//             var jsonvalues=[];
//             var today = new Date();
//             //   var url='https://www.yelp.com/search?find_desc='+industry+'&find_loc='+location+'&start='+start;
//             //   console.log("url",url);
//             var search={
//                 "location":req.query.location,
//                 "industry":req.query.industry,
//                 "search_directory":'Yelp',
//                 "date":today
//             };
//             databaseConnection.query('INSERT INTO search_history SET ?',search, function (error, scrapes, fields) {
//             if(error) {
//                 appLogger.logger.info("error ocurred",error);
//                 res.send({
//                 "code":400,
//                 "failed":"error occurred while inserting into search history"
//                 });
//             }else{
//                 appLogger.logger.info('Entry made into search history');
//             }
//             });
//             var firstQuery={
//                 'industry':req.query.industry,
//                 'location': req.query.location,
//                 'page':1
//             }
//             scrapeYelp(firstQuery);
//             for (var i = 2; i <= 10; i++) {
//                 (function (i) {
//                 setTimeout(function () {
//                     var query={
//                             'industry':req.query.industry,
//                             'location': req.query.location,
//                             'page':i
//                             }
//                     scrapeYelp(query);
//                 }, 10000*i);
//                 })(i);
//                 };
//             }else{
//                 var query="SELECT * FROM search_results WHERE searchId= '"+result[0].searchId+"'";
//                 databaseConnection.query(query,function(error, newresults, fields){
//                 if(error) {
//                     res.send({
//                     "code":500,
//                     "Failure":"Internal Server Error"
//                         });
//                     }else{
//                     res.send({
//                         "code":200,
//                         "success":"Records from db",
//                         "result":newresults,
//                         "url": "url"
//                         });
//                     }
//                 });
//             }
//         });
//         }


// exports.searchManta=function(req,res){
// // var start=(page-1)*10;

// databaseConnection.query("SELECT searchId FROM search_history where location= '"+req.query.location+"' and industry='"+req.query.industry+"'",function (error, result, fields){
//     if(error) {
//     res.send({
//         "code":500,
//         "Failure":"Internal Server Error"
//         });
//         }
//         else
//         appLogger.logger.info('results',result);
//         if(result.length==0){
//             var values=[];
//             var jsonvalues=[];
//             var today = new Date();
//         //   var url='https://www.yelp.com/search?find_desc='+industry+'&find_loc='+location+'&start='+start;
//         //   console.log("url",url);
//             var search={
//             "location":req.query.location,
//             "industry":req.query.industry,
//             "search_directory":'Yelp',
//             "date":today
//             };
//             databaseConnection.query('INSERT INTO search_history SET ?',search, function (error, scrapes, fields) {
//             if(error) {
//             appLogger.logger.info("error ocurred",error);
//             res.send({
//                 "code":400,
//                 "failed":"error occurred while inserting into search history"
//             });
//             }else{
//             appLogger.logger.info('Entry made into search history');
//             }
//             });
//             var firstQuery={
//             'industry':req.query.industry,
//             'location': req.query.location,
//             'page':1
//             }
//             scrapeYelp(firstQuery);
//             for (var i = 2; i <= 10; i++) {
//             (function (i) {
//                 setTimeout(function () {
//                 var query={
//                             'industry':req.query.industry,
//                             'location': req.query.location,
//                             'page':i
//                         }
//                 scrapeYelp(query);
//                 }, 10000*i);
//                 })(i);
//             };
//             }else{
//             var query="SELECT * FROM search_results WHERE searchId= '"+result[0].searchId+"'";
//             databaseConnection.query(query,function(error, newresults, fields){
//                 if(error) {
//                 res.send({
//                     "code":500,
//                     "Failure":"Internal Server Error"
//                     });
//                 }else{
//                     res.send({
//                     "code":200,
//                     "success":"Records from db",
//                     "result":newresults,
//                     "url": "url"
//                         });
//                 }
//                 });
//             }
//         });
//     }
