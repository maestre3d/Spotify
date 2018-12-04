// Use JS new functions
'use strict'

// Load/Import Express framework & bodyParser lib
// - bodyParser is a lib that converts HTTP request to JSON, so we can work with objects
// - Express is a framework that works as an engine for our NodeJS server & API REST. Listens any request for clients
var express = require('express');
var bodyParser = require('body-parser');



// Load routes
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

// Create express object
var app = express();

// Config bodyParser
app.use(bodyParser.urlencoded({extended:false}));
// Convert to JSON obj the HTTP requests
app.use(bodyParser.json());

// Configure HTTP Headers
// CORS
app.use((req, res, next)=>{
    // Allow access to all domains
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

// Base routes
// -Every route will have "/api" before the route (Middleware)
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

/*
// API REST Server Test with callback
app.get('/pruebas', function(req, res){
    res.status(200).send({message:"Welcome to MEAN API Server."});
});
*/
// Module export
module.exports = app;