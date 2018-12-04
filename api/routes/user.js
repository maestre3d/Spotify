'use strict'

var express = require('express');
// Load user's controller
var UserController = require('../controllers/user');

var md_auth = require('../middlewares/authenticated');

// Load express router
// - Creates a route for our API REST
var api = express.Router();

// Import multiparty
var multipart = require('connect-multiparty');
// Create multiparty's middleware
// multipart() contains JSON w upload's directory
var md_upload = multipart({uploadDir: './uploads/users'});

// Add middleware to hide route
api.get('/probando-controlador', md_auth.ensureAuth ,UserController.test);

api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
// Put() => Update DB Data
// :id => Required id, :id? => Optional
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
// Upload image, two middlewares, auth & upload_files
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload] , UserController.uploadImage);
//Get image
api.get('/get-image-user/:imageFile', UserController.getImageFile);


module.exports = api;