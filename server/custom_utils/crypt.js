var crypto = require('crypto');
var Jwt = require('jsonwebtoken');
var config = require('nconf');
config.use('file', { file: './config.json' });

var algorithm = config.get('JWTConfigs:cryptAlgorithm');
var privateKey = config.get('JWTConfigs:secretKey');


exports.decrypt = function (password) {
    
    var decipher = crypto.createDecipher(algorithm, privateKey);
    var dec = decipher.update(password, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

// method to encrypt data(password)
exports.encrypt = function (password) {
    console.log("In enCrypt : ", password, "  |  ", algorithm, privateKey);
    var cipher = crypto.createCipher(algorithm, privateKey);
    console.log("Cipher : ",cipher);
    var crypted = cipher.update(password, 'utf8', 'hex');
    console.log("Crypted: ",crypted);
    crypted += cipher.final('hex');
    console.log("Crypted 2: ",crypted);
    return crypted;
}


exports.createJWT = function (username, userid, type){
    var tokenData = {
        username : username,
        userid : userid,
        role : type,
        };
        var jwtToken = {
            username: username,
            token: Jwt.sign(tokenData, privateKey)
        };
        console.log("Final JWT", jwtToken);
        return jwtToken;
}

exports.decodeJWT = function (jwtToken){
    console.log("Decode JWT", jwtToken);
    return Jwt.decode(jwtToken);

}