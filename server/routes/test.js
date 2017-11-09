var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var Xray = require('x-ray');
var request = require('request');
var x = Xray();
// var databaseConnection = require('./database');
var appLogger=require('../custom_utils/appLogger');

var industry='coffee shops';
var location='san jose';

    console.log('inside scrapeYp function');
        var indus = industry.replace(/ /g,'+');
        var locat = location.replace(/ /g,'+');
        var page=1;
        var values=[];
        var today = new Date();
        var url='https://www.yellowpages.com/search?search_terms='+indus+'&geo_location_terms='+locat;
        // https://www.yellowpages.com/search?find_desc='+indus+'&find_loc='+locat+'&page='+page;
        console.log('url to scrape:', url);
        // appLogger.logger.info('url to scrape:', url);
        x(url, 'div.v-card', [{
            business_name:'a.business-name',
            address: 'p.adr',
            phone: 'div.phone.primary',
            website:'a@href'
            }])(function(err, data){                    
                    for(var i=0; i< data.length; i++){
                        var add= data[i].address+" ";
                        values.push([data[i].business_name,add,data[i].phone,results[i].website,location,industry]);
                        console.log([data[i].business_name,add,data[i].phone,results[i].website,location,industry]);
                    }
                    console.log(values);
                    // setTimeout(function(){
                    //     console.log(values);
                    //     databaseConnection.query('INSERT INTO search_results (business_name, address, phone, website, search_location, industry) VALUES ?', [values], function(err,result) {
                    //     if(err) {
                    //         appLogger.logger.error('Database Error');
                    //     }
                    //     else {
                    //         appLogger.logger.info('Successfully inserted scraped data to Database'," | ", "page",page);
                    //     }
                    //     });
                    // },5000);
                
            });       
        