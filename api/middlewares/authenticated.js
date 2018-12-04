// Middleware = Method that executes before controller's action
'use strict'

// Load JWT lib
var jwt = require('jwt-simple');
// Load MomentJS module
var moment = require('moment');
// Secret pass init
var secret = 'secret_pass';

// Method, Validates token's data is correct
// - Next = get out middleware
exports.ensureAuth = function(req, res, next){
    // Get authorization
    // If head doesn't exist
    if(!req.headers.authorization){
        return res.status(403).send({message: "Action needs logged user"});
    }

    // Auth header exists
    // token = Header's token through POST
    // replace used to delete all quote marks
    var token = req.headers.authorization.replace(/['"]+/g, '');

    // Decode JWT token
    try{
        // Load payload, decode() receives header token and jwt needed secret pass to decode
        var payload = jwt.decode(token, secret);

        // Throws a JSON-format error message if token has expired
        if(payload.exp <= moment().unix()){
            return res.status(401).send({message:"Token has expired"});
        }
    }catch(ex){
        //console.log(ex);
        return res.status(404).send({message:"Token not valid"});
    }

    // Return payload

    // Assign the request user's properties
    // It returns user until expiration date
    req.user = payload;

    // Exit middleware
    next();

}; 