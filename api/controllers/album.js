'use strict'

// Load path and filesystem libs
var path = require('path');
var fs = require('fs');

// Get schemes
var Artists = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var mongoosePaginate = require('mongoose-pagination');

function getAlbum(req, res){
    var albumId = req.params.id;
    
    // Populate artist's object data assoc artist's property
    // Load all artist data with an object
    Album.findById(albumId).populate({path: 'artist'}).exec((err, album)=>{
        if(err){
            res.status(500).send({message: "Server Error"});
        }else{
            if(!album){
                res.status(404).send({message: "Album not found"});
            }else{
                res.status(200).send({album});
            }
        }
    });
}

function getAlbums(req, res){
    var artistId= req.params.artist;

    if(!artistId){
        // Get all albums
        var find = Album.find().sort('title');
    }else{
        // Get all artist's albums
        var find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err, albums)=>{
        if(err){
            res.status(500).send({message: "Server error"});
        }else{
            if(!albums){
                res.status(404).send({message: "This artist has no albums"});
            }else{
                res.status(200).send({albums});
            }
        }
    });
}

function saveAlbum(req, res){
    var album = new Album();
    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if(err){
            res.status(500).send({message: 'Server error'});
        }else{
            if(!albumStored){
                res.status(404).send({message: 'Album cannot be stored'});
            }else{
                res.status(200).send({album: albumStored});
            }
        }
    });
}

function updateAlbum(req, res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated)=>{
        if(err){
            res.status(500).send({message: 'Server Error'});
        }else{
            if(!albumUpdated){
                res.status(404).send({message: 'Album cannot be updated'});
            }else{
                res.status(200).send({album: albumUpdated});
            }
        }
    });
}

function deleteAlbum(req, res){
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumRemoved)=>{
        if(err){
            res.status(500).send({message:"Album cannot be deleted"});
        }else{
            if(!albumRemoved){
                res.status(404).send({message:"Album wasn't deleted"});
            }else{
                //res.status(404).send({message: "Album removed"});
                // Delete all songs
                Song.find({album: albumRemoved._id}).deleteOne((err, songRemoved) =>{
                    if(err){
                        res.status(500).send({message:"Server Error"});
                    }else{
                        if(!songRemoved){
                            res.status(404).send({message:"Song wasn't deleted"});
                        }else{
                            res.status(200).send({album: albumRemoved});
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res){
    var albumId = req.params.id;
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
            Album.findByIdAndUpdate(albumId, {image:file_name}, (err, albumUpdated) =>{
                if(err){
                    res.status(500).send({message:"Server Error: Error updating image"});
                }else{
                    if(!albumUpdated){
                        res.status(404).send({message:"Image cannot be uploaded"})
                    }else{
                        res.status(200).send({album:albumUpdated});
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

    var path_file = './uploads/albums/'+imageFile;

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

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};