'use strict'

// Load JWT lib
var jwt = require('jwt-simple');
// Load MomentJS module
// - Makes inside payload (Payload = Object that encode JWT's data) save it to a token
//   It contains the token's date creation and token's expiration date
var moment = require('moment');
// Secret pass init
var secret = 'secret_pass';

// Exports createToken Method, receives user object
exports.createToken = function(user){
    // Manually create JSON to save it into payload/token
    // - iat = token's creation date with UNIX Timestamp
    // - exp = token's expiration date with UNIX Timestamp
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    // Return encoded token
    // - Secret = generates secret pass
    return jwt.encode(payload, secret);
};