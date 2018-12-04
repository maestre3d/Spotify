'use strict'

// Import the model
var User = require('../models/user');
// Import bcrypt
// -Bcrypt works to encrypt user's passwords (or a simple string)
var bcrypt = require('bcrypt-nodejs');

// Import jwt service
var jwt = require('../services/jwt');

// Import file_system to work w paths/files
var fs =  require('fs');
var path = require('path');


// Test method, works to verify the API REST could use controller's methods
function test(req, res){
    res.status(200).send({
        message: "Testing user's controller action with API REST NodeJS-Mongo"
    });
}

// Save User method (Receives a request, returns a response)
function saveUser(req, res){
    // Instance User module, object created
    var user = new User();

    // Get params (all data) got through POST
    // Get data converted to JSON thanks to bodyParser
    var params = req.body;

    // Verify params values
    console.log(params);

    // Assign to the user object the data got through POST (Thanks to params var)
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    // * user.role = 'ROLE_ADMIN';
    user.role = 'ROLE_USER';
    user.image = null;

    // Verify password exists
    if(params.password){
        // Encrypt pass and save data w callback
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;

            // Verify if user's name, surname and email is not null
            if( user.name != null && user.surname != null && user.email != null && user.name != '' && user.surname != '' && user.email != '' && user.password != '' ){
                User.findOne({email: user.email}, (err, userE)=>{
                    if(err){
                        res.status(500).send({message: 'Server Error'});
                    }else{
                        if(!userE){
                            // res.status(200).send({user:userE});
                            // Save user to Data Base
                            // Arrow Callback to get the user saved
                            user.save((err, userStored) => {
                                if(err){
                                    res.status(500).send({message:"User not saved"});
                                }else{
                                    // Verify user is correctly stored
                                    // - !userStored, means userStored doesn't exists
                                    if(!userStored){
                                        res.status(404).send({message:"User not registered"});
                                    }else{
                                        res.status(200).send({user:userStored});
                                    }
                                }
                            });    
                        }else{
                            res.status(404).send({message: 'User Already exists'});
                        }
                    }
                });
            }else{
                // Status 200 - Simple error
                // Status 500 - Server Error/Data Not Saved/Exception
                // Status 400 -  DB Error/File doesn't exists
                res.status(404).send({message:"Fill all fields"});

            }
        });
    }else{
        // Return error 500
        res.status(200).send({
            message: "Enter your password"
        });
    }
}

// Login Method
// Verify POST data, verify if email exists and password is correct
function loginUser(req, res){
    // Get params (all data) got through POST
    // Get data converted to JSON thanks to bodyParser
    var params = req.body;

    // Data gathered
    // Assign to the user object the data got through POST (Thanks to params var)
    var email = params.email;
    var usern = params.username;
    var password = params.password;

    if(!email){
        // Query
        // Arrow Callback, return error or user obj
        User.findOne({username:usern.toLowerCase()}, (err, user) =>{
            if(err){
                res.status(500).send({message:"Request Error"});
            }else{
                // Verify user exists and obj is fine
                if(!user){
                    res.status(404).send({message:"User doesn't exists"});
                }else{
                    // Check password, callback function
                    // Compares pass sent by user with pass stored on user's object
                    bcrypt.compare(password, user.password, function(err, check){
                        // Verify if check is correct
                        if(check){
                            // Return logged user data

                            // Verify if getHash exists
                            if(params.gethash){
                                // Return JWT Token
                                // It will allow user to do actions with API
                                // Create a logged user's token and return it
                                res.status(200).send({
                                    token: jwt.createToken(user)
                                });

                            }else{
                                // Empty hash
                                res.status(200).send({user});
                            }
                        }else{
                            res.status(404).send({message:"Incorrect password"});
                        }
                    });
                }
            }
        });
    }else{
        // Query
        // Arrow Callback, return error or user obj
        User.findOne({email:email.toLowerCase()}, (err, user) =>{
            if(err){
                res.status(500).send({message:"Request Error"});
            }else{
                // Verify user exists and obj is fine
                if(!user){
                    res.status(404).send({message:"Email doesn't exists"});
                }else{
                    // Check password, callback function
                    // Compares pass sent by user with pass stored on user's object
                    bcrypt.compare(password, user.password, function(err, check){
                        // Verify if check is correct
                        if(check){
                            // Return logged user data

                            // Verify if getHash exists
                            if(params.gethash){
                                // Return JWT Token
                                // It will allow user to do actions with API
                                // Create a logged user's token and return it
                                res.status(200).send({
                                    token: jwt.createToken(user)
                                });

                            }else{
                                // Empty hash
                                res.status(200).send({user});
                            }
                        }else{
                            res.status(404).send({message:"Incorrect password"});
                        }
                    });
                }
            }
        });
    }
}

// Update User Method
function updateUser(req, res){
    // Get ID from URL
    var userId = req.params.id;
    // Get body from POST
    var update = req.body;

    if(userId != req.user.sub){
        return res.status(500).send({message:"Forbidden action"});
    }

    // Update user
    // Receives userid from URL and the body's object
    // Return an error or the updated user if everyhting is correct through arrow callback
    User.findByIdAndUpdate(userId, update, (err, userUpdated) =>{
        if(err){
            res.status(500).send({message:"Error updating user"});
        }else{
            if(!userUpdated){
                res.status(404).send({message:"User cannot be updated"});
            }else{
                res.status(200).send({user:userUpdated});
            }
        }
    });
}

// Upload archives Method
function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'Not uploaded';

    // If theres existing data through files
    if(req.files){
        // Get file's path
        var file_path = req.files.image.path;
        // Cut file's path
        var file_split = file_path.split('\\');
        // Separate path into an array
        var file_name = file_split[2];

        // Verify if it is an image
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            // add image path to DB
            User.findByIdAndUpdate(userId, {image:file_name}, (err, userUpdated) =>{
                if(err){
                    res.status(500).send({message:"Server Error: Error updating image"});
                }else{
                    if(!userUpdated){
                        res.status(404).send({message:"Image cannot be uploaded"})
                    }else{
                        res.status(200).send({image: file_name, user:userUpdated});
                    }
                }
            });
        }else{
            res.status(200).send({message:"Image format not valid"});
        }

        //console.log(file_split);
        //res.status(200).send({message:file_path});
    }else{
        res.status(200).send({message:"Image not uploaded"});
    }
}

function getImageFile(req, res){
    // Get image file from POST
    var imageFile = req.params.imageFile;

    var path_file = './uploads/users/'+imageFile;

    // Verify if file exists
    fs.exists(path_file, function(exists){
        // Verify if callback's param is correct
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message:"Image not found"});
        }
    });
}

// Methods to export
module.exports = {
    test,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};