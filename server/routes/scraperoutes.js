var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var Xray = require('x-ray');
var request = require('request');
var x = Xray();
const makeDriver = require('request-x-ray');
var databaseConnection = require('./database');
var appLogger=require('../custom_utils/appLogger');

function scrapeGoogle(businessName, address){
    var query=businessName+'+'+address;
    var formattedQuery = query.replace(/ /g,'+');
    var url='https://www.google.co.in/search?ei=9gsJWvDSM8TEvQTKwqvoCA&q='+query+'email+address';
    x(url, 'div#rhs_block.r-iDxoY1VDfDV8 rhstc5', [{
        email:'span.xme',
        contact:'span.ZCm'
            }])(function(err, results){
            if(err){
                appLogger.logger.error('Error in scraping page');
            }else{     
                for(var i=0; i< results.length; i++){
                var phn= results[i].phone.replace(/\n        |\n    /g,'');
                values.push([results[i].business_name,address,phn,url,query.location,query.industry]);
                    }
                setTimeout(function(){
                databaseConnection.query('UPDATE search_results (business_name, address, phone, website, search_location, industry) VALUES ?', [values], function(err,result) {
                    if(err) {
                        appLogger.logger.error("Database Error while inserting data from yelp's page");
                    }
                    else {
                        appLogger.logger.info("Successfully inserted Yelp's scraped data to Database | ", "page",page);
                    }
                    });
        
                },7000);
            }
        });
}

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
            if(err){
                appLogger.logger.error('Error in scraping page');
            }else{     
                for(var i=0; i< results.length; i++){
                var add= results[i].address.replace(/\n        |\n    /g,'');
                var address= add +" ";
                var phn= results[i].phone.replace(/\n        |\n    /g,'');
                values.push([results[i].business_name,address,phn,url,query.location,query.industry]);
                    }
                setTimeout(function(){
                databaseConnection.query('INSERT INTO search_results (business_name, address, phone, website, search_location, industry) VALUES ?', [values], function(err,result) {
                    if(err) {
                        appLogger.logger.error("Database Error while inserting data from yelp's page");
                    }
                    else {
                        appLogger.logger.info("Successfully inserted Yelp's scraped data to Database | ", "page",page);
                    }
                    });
        
                },7000);
            }
        });
  
    }

function scrapeYp(query){
console.log('inside scrapeYp function');
    var industry = query.industry.replace(/ /g,'+');
    var location = query.location.replace(/ /g,'+');
    var page=query.page;
    var values=[];
    var today = new Date();
    var url='https://www.yellowpages.com/search?search_terms='+industry+'&geo_location_terms='+location+'&page='+page;
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
                },8000);
        });       
    }

function scrapeManta(query){
    console.log('inside scrapeManta function');
    var cookieDynamicString;
    request('https://www.manta.com/favicon.ico', function (error, response, body) {
        var resp = response.headers["set-cookie"];
        appLogger.logger.info('set-cookie', resp[2]);
        cookieDynamicString=resp[2];
      });
      var newCookie= 'D_SID=122.176.240.207:zAqhjwOSOe66xh01F8N7Q+mNQH10G7c8OXRvXrWwLEQ; ipCountry=IN; locHistory=%5B%22Chicago%7CIL%7C41.9288%7C-87.6315%22%5D; _pk_id.48.54ed=aad26054fdbcc6f2.1510400818.1.1510400856.1510400818.; __gads=ID=8fccc58062b5ca7b:T=1510499366:S=ALNI_MYu1wmP9KBDqx6bBM9a7O322odCUQ; _dm_sync=true; _dm_bid=true; OX_plg=pm; cust_id=47de2d82-0dea-4c07-b91d-8f89bc6628bc; refer_id=0000; manta_session=%7B%22loginIp%22%3A%2210.78.36.208%22%2C%22subId%22%3A%22%22%2C%22touchTimestamp%22%3A%221510508257758%22%2C%22userRole%22%3A%22%22%2C%22notifType%22%3A%22%22%7D; city=Delhi; state=07; lat=28.666702; lon=77.216705; '+cookieDynamicString+' calltrk_referrer=https%3A//www.manta.com/; calltrk_landing=https%3A//www.manta.com/; _ga=GA1.2.1378812368.1510399865; _gid=GA1.2.55856474.1510499290; mp_f6712b90922aca648f9e2307427ca86f_mixpanel=%7B%22distinct_id%22%3A%20%2215faad8e263a03-094207bf8bc0e1-31607c00-13c680-15faad8e264354%22%2C%22offHours%22%3A%20true%2C%22treatment%22%3A%20%22revenue_no_test%22%2C%22altTreatment1%22%3A%20%22checkout_fake_test%22%2C%22altTreatment2%22%3A%20%22control%22%2C%22altTreatment3%22%3A%20%22%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.manta.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.manta.com%22%7D; mp_mixpanel__c=0; D_IID=7C5B0137-D1B4-30CD-A7A8-40243DD3BC54; D_UID=E6371ABA-80ED-3F8F-89A8-CAF99F25217D; D_ZID=91C0BE32-A1BB-365A-A7E6-022431CC8222; D_ZUID=7EB23CE6-77F6-37DD-9381-22FA4A223B70; D_HID=4610E1B0-842D-39A6-A564-5CAB68856743';
        var industry = query.industry.replace(/ /g,'+');
        var location = query.location.replace(/ /g,'+');
        var page=query.page;
        var values=[];
        var today = new Date();
        var url='https://www.manta.com/search?search_source=business&search='+industry+'&search_location='+location+'pg='+page+'&pt=41.9288%2C-87.6315'
        const options = {
            method: "GET", 						//Set HTTP method 
            jar: true, 							//Enable cookies 
            headers: {							//Set headers 
                "User-Agent": "Firefox/48.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Cookie": newCookie
            }
        } 
        const driver = makeDriver(options)		//Create driver  
        x.driver(driver)						//Set driver  
        appLogger.logger.info('url to scrape:', url);
        x(url, 'div.media pl-xs', [{
            business_name:'h2',
            address: 'div.mvm mhn',
            phone: 'div.hidden-device-xs',
            website:'a.text-muted@href'
            }])(function(err, results){ 
                console.log(results);             
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
                    },9000);
            });       
        }


exports.search=function(req,res){
    console.log("inside search function");
    var query="SELECT searchId FROM search_history where location= '"+req.query.location+"' and industry='"+req.query.industry+"'";
    databaseConnection.query(query,function (error, result, fields){
        console.log("result from query | ", result);
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
                        "date":today
                        };
                    databaseConnection.query('INSERT INTO search_history SET ?',searchQueries, function (error, scrapes, fields) {
                        if(error) {
                            console.log("Error in insert query")
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