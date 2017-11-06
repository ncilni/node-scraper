
var mysql = require('mysql');
var config = require('nconf');


var logger = require('winston');
require('winston-daily-rotate-file');


config.use('file', { file: './config.json' });
var settings = config.get('databaseSettings');
logger.info("Connecting Database : ", config.get('databaseSettings:host'), ":", config.get('databaseSettings:port'));


var db;
function connectDatabase() {
    if (!db) {
        db = mysql.createConnection(settings);
        db.connect(function(err){   
            if(!err) {
                logger.info('Database Connection Established');
            } else {
                logger.error('Database Connection Failed');
            }
        });
    }
    return db;
}
module.exports = connectDatabase();