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


function GetyelppageNumbers(indus, loc){
  var resulturl='https://www.yelp.com/search?find_desc='+indus+'&find_loc='+loc+'&start=0';
  var pages;
  var records;
  var finalpages;
  var pagesNumber;
  console.log()
  x(resulturl, 'div.top-shelf', [{
    TotalResults:'span.pagination-results-window'
    }])(function(err, results){
      records= results[0].TotalResults.replace(/\n            Showing 1-10 of |\n        /g,'');
      console.log('no of pages', records);
      pages=Math.round(records/10);
      if(pages>100){
        finalpages=99;
        console.log('final pages=',finalpages);
      }else{
        finalpages=pages;
        console.log('final pages=',finalpages);
      }
    });
    pagesNumber=finalpages;
    while(pagesNumber === undefined) {
      require('deasync').runLoopOnce();
    }
    return pagesNumber;
}
exports.searchyelp = function(req,res){
  var searchId;
  var industry = req.query.industry.replace(/ /g,'+');
  var location = req.query.location.replace(/ /g,'+');
  connection.query('SELECT searchId FROM searchhistory ORDER BY searchId DESC LIMIT 1 ',function (error, result, fields){
  if(error) {
    console.log("error ocurred",error);
    }else{
      searchId=result[0].searchId + 1;
    }
  });
  console.log("req",req.query);
  var values=[];
  var jsonvalues=[];
  var today = new Date();
  var industry = req.query.industry.replace(/ /g,'%20');
  var location = req.query.location.replace(/ /g,'%20');//"Test%20-%20Text"
  var url='https://www.yelp.com/search?find_desc='+industry+'&find_loc='+location;
  var search={
    "location":req.query.location,
    "industry":req.query.industry,
    "date":today,
    "SearchDir":'Yelp'
  };
  connection.query('INSERT INTO searchhistory SET ?',search, function (error, scrapes, fields) {
  if(error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    });
  }else{
    console.log('Entry made into search history');
  }
  });
  x(url, 'div.search-result', [{
  Name:'a.biz-name.js-analytics-click',
  address: 'address',
  phone: 'span.biz-phone'
  }])(function(err, results){
  for(var i=0; i< results.length; i++){

  // values.push([results[i].Name,results[i].address, results[i].phone]);
  var add= results[i].address.replace(/\n        |\n    /g,'');
  var phn= results[i].phone.replace(/\n        |\n    /g,'');
  // var web='https://www..com';
  values.push([results[i].Name,add,phn,url,searchId]);
  jsonvalues.push({"Name":results[i].Name,"address":add,"phone":phn});
  }
  console.log('values', values);
  console.log('json', jsonvalues);
  connection.query('INSERT INTO Results (Name, address, phone,website,SearchId) VALUES ?', [values], function(err,result) {
    if(err) {
       console.log('DB Error');
     }
    else {
       console.log('Success');
     }
    });
    res.send({
    "code":200,
    "success":"entry made successfully",
    "result":jsonvalues,
    "url": url
      });
    });
};

exports.searchyelp = function(req,res){
  var searchId;
  var industry = req.query.industry.replace(/ /g,'+');
  var location = req.query.location.replace(/ /g,'+');
  connection.query("SELECT searchId FROM search_history where location= '"+req.query.location+"' and industry='"+req.query.industry+"' and search_directory='Yelp'",function (error, result, fields){
    if(error) {
      res.send({
        "code":500,
        "Failure":"Internal Server Error"
          });
        }
        else
          {
          console.log('results',result);
          if(result.length==0){            
              connection.query('SELECT searchId FROM search_history ORDER BY searchId DESC LIMIT 1 ',function (error, result, fields){
              if(error) {
                console.log("error occurred",error);
                }else{
                  searchId=result[0].searchId + 1;
                }
              });
            var values=[];
            var jsonvalues=[];
            var today = new Date();
            var url='https://www.yelp.com/search?find_desc='+industry+'&find_loc='+location;
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
            x(url, 'div.search-result', [{
              business_name:'a.biz-name.js-analytics-click',
              address: 'address',
              phone: 'span.biz-phone'
              }])(function(err, results){
              for(var i=0; i< results.length; i++){
              var add= results[i].address.replace(/\n        |\n    /g,'');
              var address= add +" ";
              var phn= results[i].phone.replace(/\n        |\n    /g,'');
              values.push([results[i].business_name,address,phn,url,searchId]);
              jsonvalues.push({"Business Name":results[i].Name,"address":add,"phone":phn,"website":url, "search ID":searchId });
              }
              console.log('values', values);
              console.log('json', jsonvalues);
              connection.query('INSERT INTO search_results (business_name, address, phone, website, searchId) VALUES ?', [values], function(err,result) {
                if(err) {
                  console.log('DB Error');          
                }
                else {
                  console.log('Successfully entered into the DB');
                }
                });
                res.send({
                "code":200,
                "success":"entry made successfully",
                "result":jsonvalues,
                "url": url
                  });
                });
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
        }
    });
}


exports.searchyp = function(req,res){
  var searchId;
  var industry = req.query.industry.replace(/ /g,'+');
  var location = req.query.location.replace(/ /g,'+');
  connection.query("SELECT searchId FROM search_history where location= '"+req.query.location+"' and industry='"+req.query.industry+"' and search_directory='Yellow Pages'",function (error, result, fields){
    if(error) {
      res.send({
        "code":500,
        "Failure":"Internal Server Error"
          });
        }
        else
          {
          console.log('results',result);
          if(result.length==0){            
              connection.query('SELECT searchId FROM search_history ORDER BY searchId DESC LIMIT 1 ',function (error, result, fields){
              if(error) {
                console.log("error occurred",error);
                }else{
                  searchId=result[0].searchId + 1;
                }
              });
            var values=[];
            var jsonvalues=[];
            var today = new Date();
            var url='https://www.yellowpages.com/search?search_terms='+industry+'&geo_location_terms='+location;
            var search={
              "location":req.query.location,
              "industry":req.query.industry,
              "search_directory":'Yellow Pages',
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
            x(url, 'div.v-card', [{
            business_name:'a.business-name',
            address: 'p.adr',
            phone: 'div.phone.primary',
            website:'a@href'
            }])(function(err, results){
              console.log('scraped results',results);
              for(var i=0; i< results.length; i++){
              var add= results[i].address+" ";
              values.push([results[i].business_name,add,results[i].phone,results[i].website,searchId]);
              jsonvalues.push({"Business Name":results[i].business_name,"address":add,"phone":results[i].phone,"website":results[i].website, "search ID":searchId});
              }
              connection.query('INSERT INTO search_results (business_name, address, phone, website, searchId) VALUES ?', [values], function(err,result) {
                if(err) {
                  console.log('DB Error');          
                }
                else {
                  console.log('Successfully entered into the DB');
                }
                });
                res.send({
                "code":200,
                "success":"entry made successfully",
                "result":jsonvalues,
                "url": url
                  });
                });
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
        }
    });
}

exports.searchmanta = function(req,res){

    var searchId;
    var industry = req.query.industry.replace(/ /g,'+');
    var location = req.query.location.replace(/ /g,'+');
    connection.query("SELECT searchId FROM search_history where location= '"+req.query.location+"' and industry='"+req.query.industry+"' and search_directory='Manta'",function (error, result, fields){
      if(error) {
        res.send({
          "code":500,
          "Failure":"Internal Server Error"
            });
          }else{
            console.log('results',result);
            if(result.length==0){            
                connection.query('SELECT searchId FROM search_history ORDER BY searchId DESC LIMIT 1 ',function (error, result, fields){
                if(error) {
                  console.log("error occurred",error);
                  }else{
                    searchId=result[0].searchId + 1;
                  }
                });
              var values=[];
              var jsonvalues=[];
              var today = new Date();
              var url='https://www.manta.com/search?search_source=business&search='+industry+'&search_location='+location+'&pt=';
              // var url='https://www.manta.com/search?search_source=business&search=plumbing+services&search_location=Denver+CO&pt=39.7525%2C-10';
              var search={
                "location":req.query.location,
                "industry":req.query.industry,
                "search_directory":'Manta',
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
              // x(url, 'div.v-card', [{
              // Name:'a.business-name',
              // address: 'p.adr',
              // phone: 'div.phone.primary',
              // website:'a@href'
              // }])
              x(url,'body@html')(function(err, result) {
                console.log(result) // Google 
              
             
             
             
              // x(url, 'li.list-group-item.organic-result.pln', [{
              //   Name:'a.media-heading.text-primary.h4 strong',
              //   address: 'div.mvm.mhn',
              //   phone: 'div.hidden-device-xs'
              //   }])(function(err, results){
              //   console.log('scraped results',results);
             
             
             
             
              //for(var i=0; i< results.length; i++){
              // values.push([results[i].Name,results[i].address, results[i].phone]);
              // var add= results[i].address.replace(/\n        |\n    /g,'');
              // var phn= results[i].phone.replace(/\n        |\n    /g,'');
              // var add= results[i].address+" ";
              // values.push([results[i].Name,add,results[i].phone,results[i].website,searchId]);
              // jsonvalues.push({"Name":results[i].Name,"address":add,"phone":results[i].phone,"website":results[i].website, "search ID":searchId});
              //}
              // console.log('values', values);
              // console.log('json', jsonvalues);
              // connection.query('INSERT INTO search_results (business_name, address, phone, website,SearchId) VALUES ?', [values], function(err,result) {
              //   if(err) {
              //     console.log('DB Error');
            
              //   }
              //   else {
              //     console.log('Successfully entered into the DB');
              //   }
              //   });
                // res.send({
                // "code":200,
                // "success":"entry made successfully",
                // "result":title,
                // "url": url
                //   });
                });
              }else{
                console.log('result',result);
                var recordId=result[0].searchId;
                // console.log('newsearchId=',newsearchId);
                var query="SELECT * FROM search_results WHERE searchId= '"+result[0].searchId+"'";
                console.log(query);
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
          }
      });






  // var searchId=0;
  //   connection.query('SELECT searchId FROM searchhistory ORDER BY searchId DESC LIMIT 1 ',function (error, result, fields){
  //   if(error) {
  //     console.log("error ocurred",error);
  //     }else{
  //       searchId=result[0].searchId + 1;
  //     }
  //   });
  // var values=[];
  // var jsonvalues=[];
  // var today = new Date();
  // var industry = req.query.industry.replace(/ /g,'+');
  // var location = req.query.location.replace(/ /g,'+');//"Test%20-%20Text"
  // var url='https://www.manta.com/search?search_source=business&search='+industry+'&search_location='+location+'&pt=';
  // var search={
  //   "location":req.query.location,
  //   "industry":req.query.industry,
  //   "date":today,
  //   "search_directory":'Manta'
  // };
  // connection.query('INSERT INTO search_history SET ?',search, function (error, scrapes, fields) {
  // if(error) {
  //   console.log("error ocurred",error);
  //   res.send({
  //     "code":400,
  //     "failed":"error ocurred"
  //   });
  // }else{
  //   console.log('Entry made into search history');
  // }
  // });
  // x(url, 'li.list-group-item', [{
  // Name:'strong',
  // address: 'div.mvm mhn',
  // phone: 'div.hidden-device-xs'
  // }])(function(err, results){
  //   console.log(results);
  // for(var i=0; i< results.length; i++){
  // // values.push([results[i].Name,results[i].address, results[i].phone]);
  // // var add= results[i].address.replace(/\n        |\n    /g,'');
  // // var phn= results[i].phone.replace(/\n        |\n    /g,'');
  // values.push([results[i].Name,results[i].address,results[i].phone,results[i].website,searchId]);
  // jsonvalues.push({"Name":results[i].Name,"address":results[i].address,"phone":results[i].phone,"website":results[i].website, "search ID":searchId});
  // }
  // // console.log('values', values);
  // console.log('json', jsonvalues);
  // connection.query('INSERT INTO Results (Name, address, phone, website,SearchId) VALUES ?', [values], function(err,result) {
  //   if(err) {
  //      console.log('DB Error');

  //    }
  //   else {
  //      console.log('Success');
  //    }
  //   });
  //   res.send({
  //   "code":200,
  //   "success":"entry made successfully",
  //   "result":jsonvalues,
  //   "url": url
  //     });
  //   });
  // module.exports = router;
 // setTimeout(function(){ res.send({
                    //   "code":200,
                    //   "success":"Records from db",
                    //   "result":newresults,
                    //   "url": url
                    //     }); }, 500);
};
