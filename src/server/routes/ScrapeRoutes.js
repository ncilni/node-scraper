var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var mysql = require('mysql');
var Xray = require('x-ray');
var x = Xray();
var connection = mysql.createConnection({
  host     : 'mysql.intelegencia.com',
  user     : 'user_listbuilder',
  password : 'intel@01',
  database : 'list_builder'
});
connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn");
}
});

function insertRecords(data){
  
}

function scrapeYelp(query){
    var industry = query.industry.replace(/ /g,'+');
    var location = query.location.replace(/ /g,'+');
    var page=query.page;
    var start=(page-1)*10;
    var values=[];
    var jsonvalues=[];
    var today = new Date();
    var url='https://www.yelp.com/search?find_desc='+industry+'&find_loc='+location+'&start='+start;
  
    x(url, 'div.search-result', [{
      business_name:'a.biz-name.js-analytics-click',
      address: 'address',
      phone: 'span.biz-phone'
      }])(function(err, results){
      for(var i=0; i< results.length; i++){
      var add= results[i].address.replace(/\n        |\n    /g,'');
      var address= add +" ";
      var phn= results[i].phone.replace(/\n        |\n    /g,'');
      resultId++;
      values.push([results[i].business_name,address,phn,url,searchId,query.location,query.industry]);
      jsonvalues.push({"business_name":results[i].business_name,"address":add,"phone":phn,"website":url, "search ID":searchId, "result_id":resultId, "industry":query.industry, "search_location":query.location });
      }
      console.log('values', values);
      console.log('json', jsonvalues);
      connection.query('INSERT INTO search_results (business_name, address, phone, website, searchId, search_location, industry) VALUES ?', [values], function(err,result) {
        if(err) {
          console.log('DB Error');          
        }
        else {
          console.log('Successfully entered into the DB');
        }
        });
        });
  
  }

  exports.searchYelp=function(req,res){
    // var start=(page-1)*10;
    var searchId;
    var resultId;
  
    connection.query("SELECT searchId FROM search_history where location= '"+req.query.location+"' and industry='"+req.query.industry+"' and search_directory='Yelp'",function (error, result, fields){
      if(error) {
        res.send({
          "code":500,
          "Failure":"Internal Server Error"
            });
          }
          else
            console.log('results',result);
            if(result.length==0){            
                connection.query('SELECT searchId FROM search_history ORDER BY searchId DESC LIMIT 1 ',function (error, result, fields){
                if(error) {
                  console.log("error occurred",error);
                  }else{
                    searchId=result[0].searchId + 1;
                  }
                });
                connection.query('SELECT result_id  FROM search_results ORDER BY result_id DESC LIMIT 1 ',function (error, result, fields){
                  if(error) {
                    console.log("error occurred",error);
                    }else{
                      resultId=result[0].result_id;
                    }
                  });
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
              connection.query('INSERT INTO search_history SET ?',search, function (error, scrapes, fields) {
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
                'page':1,
                'searchId':searchId,
                'resultId':resultId
              }
              scrapeYelp(firstQuery);
              for(var i=2; i<=100; i++){
              var query={
                  'industry':req.query.industry,
                  'location': req.query.location,
                  'page':i,
                  'searchId':searchId,
                  'resultId':resultId
                }
              setTimeout(scrapeYelp(query),10000);
            }
        }else{
                var query="SELECT * FROM search_results WHERE searchId= '"+result[0].searchId+"'";
                connection.query(query,function(error, newresults, fields){
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
                        "url": url
                          });
                    }
                  });              
              }
          });
        }