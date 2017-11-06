
var mysql = require('mysql');
var config = require('nconf');
var appLogger=require('../custom_utils/appLogger');


config.use('file', { file: './config.json' });
var settings = config.get('databaseSettings');
appLogger.logger.info("Connecting Database : ", config.get('databaseSettings:host'), ":", config.get('databaseSettings:port'));


var db;
function connectDatabase() {
    if (!db) {
        db = mysql.createConnection(settings);
        db.connect(function(err){
            if(!err) {
                appLogger.logger.info('Database Connection Established');
            } else {
                appLogger.logger.error('Database Connection Failed');
            }
        });
    }
    return db;
}
module.exports = connectDatabase();
