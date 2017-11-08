var express = require('express');
var router = express.Router();
var app = express();
var path = require('path');
var databaseConnection = require('./database');
var appLogger = require('../custom_utils/appLogger');
var crypt = require('../custom_utils/crypt');

app.use(express.static('/'));
app.use(express.static('dist'));
app.use('/*', express.static(path.resolve('dist')));

router.get('/', function (req, res) {  
  console.log("Get Users");
  var jwtToken= req.headers.authorization;
  console.log("Get Users");
  console.log("Query ", req.headers.authorization, " | ", crypt.decodeJWT(jwtToken).username);
  var query = "select User_Id from list_builder.users WHERE JwtToken='"+jwtToken+"' and username='"+crypt.decodeJWT(jwtToken).username+"' and type=1";
  console.log("Query ", query);
  databaseConnection.query(query,function(error, dbRecordset, fields){
    if(error) {
      res.status(500);
      res.send({
        "code":500,
        "status":"Internal Server Error"
          });
      }else{
        console.log("New Results : ", dbRecordset);
        if(dbRecordset.length>0){
            var listQuery = req.query.list;
            if (listQuery=='all'){
            var query="SELECT User_Id, firstname, lastname, username, type FROM users";
            databaseConnection.query(query,function(error, dbRecordset, fields){
            if(error) {
                res.status(500);
                res.send({
                "code":500,
                "status":"Internal Server Error"
                    });
                }else{
                res.status(200);
                res.send({
                    "code":200,
                    "status":"Success",
                    "result":dbRecordset
                    });
                }
            });
            }else{
            var query="SELECT User_Id, firstname, lastname, username, type FROM users Where User_Id="+listQuery;
            databaseConnection.query(query,function(error, dbRecordset, fields){
                if(error) {
                res.status(500);
                res.send({
                    "code":500,
                    "status":"Internal Server Error"
                    });
                }else{
                    if(dbRecordset.length==0){
                    res.status(400);
                    res.send({
                        "code":400,
                        "status":"Bad request ",
                        "message": "User Does not Exist"
                        });
                    }else{
                    res.status(200);
                    res.send({
                        "code":200,
                        "status":"Success",
                        "result":dbRecordset
                        });
                    }

                }
                });
            }
        }else{
          res.sendStatus(401);
        }
      }
  });
});

router.delete('/', function (req, res) {
  console.log("Delete Users");
  var jwtToken= req.headers.authorization;
  console.log("Delete Users");
  console.log("Query ", req.headers.authorization, " | ",crypt.decodeJWT(jwtToken).username);
  var query = "select User_Id from users WHERE JwtToken='"+jwtToken+"' and username='"+crypt.decodeJWT(jwtToken).username+"' and type=1";
  console.log("Query ", query);
  databaseConnection.query(query,function(error, dbRecordset, fields){
    if(error) {
      res.status(500);
      res.send({
        "code":500,
        "status":"Internal Server Error"
          });
      }else{
        console.log("New Results : ", dbRecordset);
        if(dbRecordset.length>0){  
          var userId = req.query.userId;
          var query="delete FROM users where user_Id="+userId;
          databaseConnection.query(query,function(error, fields){
            appLogger.logger.info('response from db',fields);
            if(error) {
              res.status(500);
              res.send({
                "code":500,
                "status":"Internal Server Error"
                  });
                } else{
                  res.status(204);
                  res.send({
                    "code":204,
                    "status":"No Content"
                    });
                }
          });
        }else{
          res.sendStatus(401);
        }
      }
  });
});


//Register User
router.post('/', function (req, res){
  req.body.password = crypt.encrypt(req.body.password);
  appLogger.logger.info('Username | Encrypted Password | Role', req.body.username, " | ", req.body.password, " | ", req.body.type);

    var values=[];
    values.push([req.body.firstname,req.body.lastname,req.body.username,req.body.password,req.body.type]);
    appLogger.logger.info('values',values);
    databaseConnection.query("SELECT * FROM users where username= '"+req.body.username+"'",function(error, dbRecordset, fields){
      if(!error) {
          appLogger.logger.info('results',dbRecordset);
            if(dbRecordset.length==0){
              databaseConnection.query('INSERT INTO users (firstname, lastname, username, password, type) VALUES ?', [values],function(error, dbRecordset){
                if(error) {
                res.status(500);
                res.send({
                    "code":500,
                    "status":"Internal Server Error"
                    });
                }else{
                    appLogger.logger.info("Send Status : ", dbRecordset, "End");
                    res.status(201);
                    res.send({
                    "code":201,
                    "status":"User Created"
                    });
                }
            });
            } else{
              res.status(400);
              res.send({
                "code":400,
                "status":"User already exists"
                    });
            }
        }
        else{
          res.status(500);
          res.send({
            "code":500,
            "status":"Internal Server Error"
          });
        }
    });
});
  

// router.put('/', function (req, res) {
//     var values=[];
//     values.push([req.body.firstname,req.body.lastname,req.body.username,req.body.password,req.body.type]);
//     appLogger.logger.info('values',values);
//     databaseConnection.query("SELECT * FROM users where username= '"+req.body.username+"'",function(error, results, fields){
//       if(!error) {
//           appLogger.logger.info('results',results);
//             if(results.length==0){
//               databaseConnection.query('INSERT INTO users (firstname, lastname, username, password, type) VALUES ?', [values],function(error, newresults){
//                 if(error) {
//                 res.status(500);
//                 res.send({
//                     "code":500,
//                     "status":"Internal Server Error"
//                     });
//                 }else{
//                     appLogger.logger.info("Send Status : ", newresults, "End");
//                     res.status(201);
//                     res.send({
//                     "code":201,
//                     "status":"User Created"
//                     });
//                 }
//             });
//             } else{
//               res.status(400);
//               res.send({
//                 "code":400,
//                 "status":"User already exists"
//                     });
//             }
//         }
//         else{
//           res.status(500);
//           res.send({
//             "code":500,
//             "status":"Internal Server Error"
//           });
//         }
//     });
// });

router.put('/', function (req, res) {


  console.log("Get History");
  var jwtToken= req.headers.authorization;
  if(crypt.decodeJWT(jwtToken).role == 0){
    res.sendStatus(401);
  }

  console.log("Query ", req.headers.authorization, " | ", crypt.decodeJWT(jwtToken).username);
  var query = "select User_Id from users WHERE JwtToken='"+jwtToken+"' and username='"+crypt.decodeJWT(jwtToken).username+"'";
  console.log("Query ", query);
  databaseConnection.query(query,function(error, dbRecordset, fields){
    if(error) {
      res.status(500);
      res.send({
        "code":500,
        "status":"Internal Server Error"
          });
    }else{
      console.log("New Results : ", dbRecordset[0].User_Id);
      if(dbRecordset.length>0){
        var query = "UPDATE list_builder.users SET firstname='"+req.body.firstname+"', lastname='"+req.body.lastname+"', username='"+req.body.username+"', type="+req.body.type+" Where user_Id="+dbRecordset[0].User_Id; 
        console.log("Update Query :", query);
        databaseConnection.query(query, function(error, dbRecordset){
          if(error) {
          res.status(500);
          res.send({
            "code":500,
            "status":"Internal Server Error"
          });
          }else{
            appLogger.logger.info("Send Status : ", dbRecordset, "End");
            res.status(200);
            res.send({
            "code":200,
            "status":"Successfully updated"
            });
          }
        });
      }
    else{
      res.sendStatus(401);
    }
  }
 });
});

module.exports = router;
