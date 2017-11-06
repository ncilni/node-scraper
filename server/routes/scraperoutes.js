var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var mysql = require('mysql');
var Xray = require('x-ray');
var x = Xray();
var databaseConnection = mysql.createConnection({
  host     : 'mysql.intelegencia.com',
  user     : 'user_listbuilder',
  password : 'intel@01',
  database : 'list_builder'
});
databaseConnection.connect(function(err){
if(!err) {
  console.log("Connected to Database :", databaseConnection.host);
  } else {
  console.log("Unable to connect to Database ");
  }
});


function scrapeYelp(query){
  console.log('inside scrapeYelp function');
    var industry = query.industry.replace(/ /g,'+');
    var location = query.location.replace(/ /g,'+');
    var page=query.page;
    var start=(page-1)*10;
    var values=[];
    var jsonvalues=[];
    var today = new Date();
    var url='https://www.yelp.com/search?find_desc='+industry+'&find_loc='+location+'&start='+start;
    console.log('page',page,'query:',query,'url:', url);
    x(url, 'div.search-result', [{
      business_name:'a.biz-name.js-analytics-click',
      address: 'address',
      phone: 'span.biz-phone'
      }])(function(err, results){
        console.log('scraped data', results)
      for(var i=0; i< results.length; i++){
        var add= results[i].address.replace(/\n        |\n    /g,'');
        var address= add +" ";
        var phn= results[i].phone.replace(/\n        |\n    /g,'');
        values.push([results[i].business_name,address,phn,url,query.location,query.industry]);
        jsonvalues.push({"business_name":results[i].business_name,"address":add,"phone":phn,"website":url, "industry":query.industry, "search_location":query.location });
      }
      setTimeout(function(){
        console.log(values);
        databaseConnection.query('INSERT INTO search_results (business_name, address, phone, website, search_location, industry) VALUES ?', [values], function(err,result) {
          if(err) {
            console.log('Database Error');
          }
          else {
            console.log('Successfully inserted to Database');
          }
          });

      },3000);
      });

  }

  function scrapeYp(query){
    console.log('inside scrapeYp function');
      var industry = query.industry.replace(/ /g,'+');
      var location = query.location.replace(/ /g,'+');
      var page=query.page;
      var start=(page-1)*10;
      var values=[];
      var jsonvalues=[];
      var today = new Date();
      var url='https://www.yellowpages.com/search?find_desc='+industry+'&find_loc='+location+'&start='+start;
      console.log('page',page,'query:',query,'url:', url);
      x(url, 'div.search-result', [{
        business_name:'a.biz-name.js-analytics-click',
        address: 'address',
        phone: 'span.biz-phone'
        }])(function(err, results){
          console.log('scraped data', results)
        for(var i=0; i< results.length; i++){
          var add= results[i].address.replace(/\n        |\n    /g,'');
          var address= add +" ";
          var phn= results[i].phone.replace(/\n        |\n    /g,'');
          values.push([results[i].business_name,address,phn,url,query.location,query.industry]);
          jsonvalues.push({"business_name":results[i].business_name,"address":add,"phone":phn,"website":url, "industry":query.industry, "search_location":query.location });
        }
        setTimeout(function(){
          console.log(values);
          databaseConnection.query('INSERT INTO search_results (business_name, address, phone, website, search_location, industry) VALUES ?', [values], function(err,result) {
            if(err) {
              console.log('DB Error');
            }
            else {
              console.log('Successfully entered into the DB');
            }
            });

        },3000);
        // console.log('values', values);
        // console.log('json', jsonvalues);

          });

    }
    function scrapeManta(query){
      console.log('inside scrapeYp function');
        var industry = query.industry.replace(/ /g,'+');
        var location = query.location.replace(/ /g,'+');
        var page=query.page;
        var start=(page-1)*10;
        var values=[];
        var jsonvalues=[];
        var today = new Date();
        var url='https://www.yellowpages.com/search?find_desc='+industry+'&find_loc='+location+'&start='+start;
        console.log('page',page,'query:',query,'url:', url);
        x(url, 'div.search-result', [{
          business_name:'a.biz-name.js-analytics-click',
          address: 'address',
          phone: 'span.biz-phone'
          }])(function(err, results){
            console.log('scraped data', results)
          for(var i=0; i< results.length; i++){
            var add= results[i].address.replace(/\n        |\n    /g,'');
            var address= add +" ";
            var phn= results[i].phone.replace(/\n        |\n    /g,'');
            values.push([results[i].business_name,address,phn,url,query.location,query.industry]);
            jsonvalues.push({"business_name":results[i].business_name,"address":add,"phone":phn,"website":url, "industry":query.industry, "search_location":query.location });
          }
          setTimeout(function(){
            console.log(values);
            databaseConnection.query('INSERT INTO search_results (business_name, address, phone, website, search_location, industry) VALUES ?', [values], function(err,result) {
              if(err) {
                console.log('DB Error');
              }
              else {
                console.log('Successfully entered into the DB');
              }
              });

          },3000);
          // console.log('values', values);
          // console.log('json', jsonvalues);

            });

      }

  exports.searchYelp=function(req,res){
    // var start=(page-1)*10;

    databaseConnection.query("SELECT searchId FROM search_history where location= '"+req.query.location+"' and industry='"+req.query.industry+"'",function (error, result, fields){
      if(error) {
        res.send({
          "code":500,
          "Failure":"Internal Server Error"
            });
          }
          else
            console.log('results',result);
            if(result.length==0){
              var values=[];
              var jsonvalues=[];
              var today = new Date();
            //   var url='https://www.yelp.com/search?find_desc='+industry+'&find_loc='+location+'&start='+start;
            //   console.log("url",url);
              var search={
                "location":req.query.location,
                "industry":req.query.industry,
                "search_directory":'Yelp',
                "date":today
              };
              databaseConnection.query('INSERT INTO search_history SET ?',search, function (error, scrapes, fields) {
              if(error) {
                console.log("error ocurred",error);
                res.send({
                  "code":400,
                  "failed":"error occurred while inserting into search history"
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
              for (var i = 2; i <= 10; i++) {
                (function (i) {
                  setTimeout(function () {
                    var query={
                              'industry':req.query.industry,
                              'location': req.query.location,
                              'page':i
                            }
                    scrapeYelp(query);
                  }, 10000*i);
                  })(i);
                };
             }else{
                var query="SELECT * FROM search_results WHERE searchId= '"+result[0].searchId+"'";
                databaseConnection.query(query,function(error, newresults, fields){
                  if(error) {
                    res.send({
                      "code":500,
                      "Failure":"Internal Server Error"
                        });
                    }else{
                      res.send({
                        "code":200,
                        "success":"Records from db",
                        "result":newresults,
                        "url": "url"
                          });
                    }
                  });
              }
          });
        }

        exports.searchYp=function(req,res){
          // var start=(page-1)*10;

          databaseConnection.query("SELECT searchId FROM search_history where location= '"+req.query.location+"' and industry='"+req.query.industry+"'",function (error, result, fields){
            if(error) {
              res.send({
                "code":500,
                "Failure":"Internal Server Error"
                  });
                }
                else
                  console.log('results',result);
                  if(result.length==0){
                    var values=[];
                    var jsonvalues=[];
                    var today = new Date();
                  //   var url='https://www.yelp.com/search?find_desc='+industry+'&find_loc='+location+'&start='+start;
                  //   console.log("url",url);
                    var search={
                      "location":req.query.location,
                      "industry":req.query.industry,
                      "search_directory":'Yelp',
                      "date":today
                    };
                    databaseConnection.query('INSERT INTO search_history SET ?',search, function (error, scrapes, fields) {
                    if(error) {
                      console.log("error ocurred",error);
                      res.send({
                        "code":400,
                        "failed":"error occurred while inserting into search history"
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
                    for (var i = 2; i <= 10; i++) {
                      (function (i) {
                        setTimeout(function () {
                          var query={
                                    'industry':req.query.industry,
                                    'location': req.query.location,
                                    'page':i
                                  }
                          scrapeYelp(query);
                        }, 10000*i);
                        })(i);
                      };
                   }else{
                      var query="SELECT * FROM search_results WHERE searchId= '"+result[0].searchId+"'";
                      databaseConnection.query(query,function(error, newresults, fields){
                        if(error) {
                          res.send({
                            "code":500,
                            "Failure":"Internal Server Error"
                              });
                          }else{
                            res.send({
                              "code":200,
                              "success":"Records from db",
                              "result":newresults,
                              "url": "url"
                                });
                          }
                        });
                    }
                });
              }


              exports.searchManta=function(req,res){
                // var start=(page-1)*10;

                databaseConnection.query("SELECT searchId FROM search_history where location= '"+req.query.location+"' and industry='"+req.query.industry+"'",function (error, result, fields){
                  if(error) {
                    res.send({
                      "code":500,
                      "Failure":"Internal Server Error"
                        });
                      }
                      else
                        console.log('results',result);
                        if(result.length==0){
                          var values=[];
                          var jsonvalues=[];
                          var today = new Date();
                        //   var url='https://www.yelp.com/search?find_desc='+industry+'&find_loc='+location+'&start='+start;
                        //   console.log("url",url);
                          var search={
                            "location":req.query.location,
                            "industry":req.query.industry,
                            "search_directory":'Yelp',
                            "date":today
                          };
                          databaseConnection.query('INSERT INTO search_history SET ?',search, function (error, scrapes, fields) {
                          if(error) {
                            console.log("error ocurred",error);
                            res.send({
                              "code":400,
                              "failed":"error occurred while inserting into search history"
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
                          for (var i = 2; i <= 10; i++) {
                            (function (i) {
                              setTimeout(function () {
                                var query={
                                          'industry':req.query.industry,
                                          'location': req.query.location,
                                          'page':i
                                        }
                                scrapeYelp(query);
                              }, 10000*i);
                              })(i);
                            };
                         }else{
                            var query="SELECT * FROM search_results WHERE searchId= '"+result[0].searchId+"'";
                            databaseConnection.query(query,function(error, newresults, fields){
                              if(error) {
                                res.send({
                                  "code":500,
                                  "Failure":"Internal Server Error"
                                    });
                                }else{
                                  res.send({
                                    "code":200,
                                    "success":"Records from db",
                                    "result":newresults,
                                    "url": "url"
                                      });
                                }
                              });
                          }
                      });
                    }
