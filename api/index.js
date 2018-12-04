// Use new JS functions
'use strict'

// Load/Import mongoose lib
// - Mongoose is a lib for JS to work with MongoDB
var mongoose = require('mongoose');
// Load/Import app.js
var app = require('./app');
// Configure port
var port = process.env.PORT || 3977;

// Avoid Mongoose's promise advice
mongoose.Promise = global.Promise;

// DB connection with callback function working as Try-Catch
mongoose.connect('mongodb://localhost:27017/mean', (err, res) => {
    // If theres an error, it will throw it, if not, it will display a message in console
    if(err){
        throw err;
        console.log("Cannot connect to DB.");
    }else{
        console.log("Connected to DB.");

        // Listen to our port with callback
        app.listen(port, function(){
            console.log("API REST Server listening on: localhost:" + port);
        });
    }
} );
