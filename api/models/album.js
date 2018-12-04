'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// artist field on JSON, It makes reference to another object,
// saving it's ID
var AlbumSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: { type : Schema.ObjectId, ref: 'Artist' }
});

module.exports = mongoose.model('Album', AlbumSchema);