var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var Xray = require('x-ray');
var request = require('request');
var request = request.defaults({jar: true});
const makeDriver = require('request-x-ray');
var x = Xray();





// function scrapeManta(query){
//     console.log('inside scrapeManta function');
//     request('https://www.manta.com/favicon.ico', function (error, response, body) {
//         console.log('error:', error); // Print the error if one occurred
//         console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//        // console.log('body:', body); // Print the HTML for the Google homepage.
//       });
//         var industry = query.industry.replace(/ /g,'+');
//         var location = query.location.replace(/ /g,'+');
//         var page=query.page;
//         var values=[];
//         var today = new Date();
//         var url=
//         'https://www.manta.com/search?search_source=business&search='+industry+'&search_location='+location+'&pt=41.9288%2C-87.6315'
//         'https://www.yellowpages.com/search?search_terms='+industry+'&geo_location_terms='+location+'&page='+page;
//         appLogger.logger.info('url to scrape:', url);
//         x(url, 'div.v-card', [{
//             business_name:'a.business-name',
//             address: 'p.adr',
//             phone: 'div.phone.primary',
//             website:'a@href'
//             }])(function(err, results){              
//                     for(var i=0; i< results.length; i++){
//                         var add= results[i].address+" ";
//                         values.push([results[i].business_name,add,results[i].phone,results[i].website,query.location,query.industry]);
//                     }
//                     setTimeout(function(){
//                         console.log(values);
//                         databaseConnection.query('INSERT INTO search_results (business_name, address, phone, website, search_location, industry) VALUES ?', [values], function(err,result) {
//                         if(err) {
//                             appLogger.logger.error('Database Error');
//                         }
//                         else {
//                             appLogger.logger.info('Successfully inserted scraped data to Database'," | ", "page",page);
//                         }
//                         });
//                     },8000);
//             });       
//         }


        // request('https://www.manta.com/favicon.ico', function (error, response, body) {
        //     console.log('error:', error); // Print the error if one occurred
        //     var resp = response.headers["set-cookie"];
        //     // console.log('statusCode:', response.headers.connection); // Print the response status code if a response was received
        //     console.log('status', resp[2]);

        //     // console.log('body:', body); // Print the HTML for the Google homepage.
        //   });


      
            console.log('inside scrapeManta function');
            var cookieDynamicString;
            var newCookie;
            request('https://www.manta.com/favicon.ico', function (error, response, body) {
                var resp = response.headers["set-cookie"];
                // appLogger.logger.info('set-cookie', resp[2]);
                cookieDynamicString=resp[2];
                newCookie= 'D_SID=122.176.240.207:zAqhjwOSOe66xh01F8N7Q+mNQH10G7c8OXRvXrWwLEQ; ipCountry=IN; locHistory=%5B%22Chicago%7CIL%7C41.9288%7C-87.6315%22%5D; _pk_id.48.54ed=aad26054fdbcc6f2.1510400818.1.1510400856.1510400818.; __gads=ID=8fccc58062b5ca7b:T=1510499366:S=ALNI_MYu1wmP9KBDqx6bBM9a7O322odCUQ; _dm_sync=true; _dm_bid=true; OX_plg=pm; cust_id=47de2d82-0dea-4c07-b91d-8f89bc6628bc; refer_id=0000; manta_session=%7B%22loginIp%22%3A%2210.78.36.208%22%2C%22subId%22%3A%22%22%2C%22touchTimestamp%22%3A%221510508257758%22%2C%22userRole%22%3A%22%22%2C%22notifType%22%3A%22%22%7D; city=Delhi; state=07; lat=28.666702; lon=77.216705; '+cookieDynamicString+' calltrk_referrer=https%3A//www.manta.com/; calltrk_landing=https%3A//www.manta.com/; _ga=GA1.2.1378812368.1510399865; _gid=GA1.2.55856474.1510499290; mp_f6712b90922aca648f9e2307427ca86f_mixpanel=%7B%22distinct_id%22%3A%20%2215faad8e263a03-094207bf8bc0e1-31607c00-13c680-15faad8e264354%22%2C%22offHours%22%3A%20true%2C%22treatment%22%3A%20%22revenue_no_test%22%2C%22altTreatment1%22%3A%20%22checkout_fake_test%22%2C%22altTreatment2%22%3A%20%22control%22%2C%22altTreatment3%22%3A%20%22%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.manta.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.manta.com%22%7D; mp_mixpanel__c=0; D_IID=7C5B0137-D1B4-30CD-A7A8-40243DD3BC54; D_UID=E6371ABA-80ED-3F8F-89A8-CAF99F25217D; D_ZID=91C0BE32-A1BB-365A-A7E6-022431CC8222; D_ZUID=7EB23CE6-77F6-37DD-9381-22FA4A223B70; D_HID=4610E1B0-842D-39A6-A564-5CAB68856743';
                console.log('new cookie', newCookie);
                var location='Chicago IL';
                var industry='plumbing services';
                var indus = industry.replace(/ /g,'+');
                var locat = location.replace(/ /g,'+');
                var page=2;
                var values=[];
                  var today = new Date();
                  var url='https://www.manta.com/search?search_source=business&search='+industry+'&search_location='+location+'pg='+page+'&pt=41.9288%2C-87.6315'
                  console.log(url);
                //   const options = {
                //       method: "GET", 						//Set HTTP method 
                //       jar: true, 							//Enable cookies 
                //       headers: {							//Set headers 
                //           "User-Agent": "Firefox/48.0",
                //           "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                //           "Cookie": newCookie
                //       }
                //   } 

                  var options = {
                    'url': url,
                    'headers': {
                        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                        "Cookie": newCookie
                    }
                  };
                   
                  function callback(error, response, body) {
                    console.log(response);
                    console.log(body);
                  }
                   
                  request(options, callback);






                //   const driver = makeDriver(options)		//Create driver  
                //   x.driver(driver)						//Set driver  
                //   // appLogger.logger.info('url to scrape:', url);
                //   x(url, 'div.media pl-xs', [{
                //       business_name:'h2',
                //       address: 'div.mvm mhn',
                //       phone: 'div.hidden-device-xs',
                //       website:'a.text-muted@href'
                //       }])(function(err, results){ 
                //           console.log(results);             
                //               for(var i=0; i< results.length; i++){
                //                   var add= results[i].address+" ";
                //                   values.push([results[i].business_name,add,results[i].phone,results[i].website,query.location,query.industry]);
                //               }
                //               setTimeout(function(){
                //                 console.log('results',results);
                //               },7000);
                //               // setTimeout(function(){
                //               //     console.log(values);
                //               //     databaseConnection.query('INSERT INTO search_results (business_name, address, phone, website, search_location, industry) VALUES ?', [values], function(err,result) {
                //               //     if(err) {
                //               //         appLogger.logger.error('Database Error');
                //               //     }
                //               //     else {
                //               //         appLogger.logger.info('Successfully inserted scraped data to Database'," | ", "page",page);
                //               //     }
                //               //     });
                //               // },9000);
                //       });       
              });
              
             