var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var mysql = require('mysql');
var json2csv = require('json2csv');
var fs = require('fs');
var mkdirp = require('mkdirp');
var json2xls = require('json2xls');

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

exports.csv = function(req,res){
    var query="SELECT * FROM search_results WHERE search_location= '"+req.query.location+"' and industry='"+req.query.industry+"'";
    console.log('query', query);
    connection.query(query,function(error, newresults, fields){
      if(error) {
        res.send({
          "code":500,
          "Failure":"Internal Server Error"
            });
        }else{
          // console.log(newresults);
          var industry = req.query.industry.replace(/ /g,'');
          var location = req.query.location.replace(/ /g,'');
          var fileName=location+'_'+industry;
          var fields = ['result_id', 'business_name', 'address', 'email', 'contact_name', 'job_title', 'phone', 'industry', 'search_location', 'website', 'searchId'];
          var fieldNames = ['Result Id', 'Business Name', 'Address', 'Email', 'Contact name', 'Job title', 'Phone', 'Industry', 'Search location', 'Website', 'Search Id'];
          var csv = json2csv({ data: newresults, fields: fields, fieldNames: fieldNames });
            mkdirp('tmp/csv/', function (err) {
                if (err) {console.error(err)}
                else {console.log('pow!')
                    fs.writeFile('tmp/csv/'+fileName+'.csv', csv, function(err) {
                        if(err){
                            throw err
                            }else{
                                console.log('file saved as', fileName);
                                res.send({
                                    "code":200,
                                    "success":"File download successful",
                                    "file_name":fileName,
                                    "format":'csv'
                                      });    
                        }
                        console.log('file saved as', fileName);
                      });
                
                }
            });

        
         
        }
      });        
}

exports.xls = function(req,res){
    var query="SELECT * FROM search_results WHERE search_location= '"+req.query.location+"' and industry='"+req.query.industry+"'";
    console.log('query', query);
    connection.query(query,function(error, newresults, fields){
      if(error) {
        res.send({
          "code":500,
          "Failure":"Internal Server Error"
            });
        }else{
          var industry = req.query.industry.replace(/ /g,'');
          var location = req.query.location.replace(/ /g,'');
          var fileName=location+'_'+industry;
            mkdirp('tmp/xls/', function (err) {
                if (err) {console.error(err)}
                else {console.log('pow!')
                var xls = json2xls(newresults);
                fs.writeFileSync('tmp/xls/'+fileName+'.xls', xls, 'binary');
                console.log('file saved as', fileName);
                res.send({
                    "code":200,
                    "success":"File download successful",
                    "file_name":fileName,
                    "format":'csv'
                      });                   
                }
            });         
        }
      });  
}

exports.pdf = function(req,res){
    
}


