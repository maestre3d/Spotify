'use strict'

// Load Mongoose module/lib
var mongoose = require('mongoose');
// Define DB scheme
// - Create obj Schema type, so we can save JSON documents to the collection
var Schema = mongoose.Schema;
var UserSchema = Schema({
    name: String,
    surname: String,
    username: String,
    email: String,
    password: String,
    role: String,
    image: String
});

// Export user model, export an User's Object
module.exports = mongoose.model('User', UserSchema);