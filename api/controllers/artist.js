'use strict'

// Load path and filesystem libs
var path = require('path');
var fs = require('fs');


// Get schemes
var Artists = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var mongoosePaginate = require('mongoose-pagination');

function getArtist(req, res){
    var artistId = req.params.id;

    Artists.findById(artistId, (err, artist) => {
        if(err){
            res.status(500).send({
                message: "Server error"
            });
        }else{
            if(!artist){
                res.status(404).send({
                    message: "Artist does not exists."
                });
            }else{
                res.status(200).send({
                    artist
                });
            }
        }
    });
}

function getArtists(req, res){
    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1;
    }
    // Recieves a param on URL
    var params = req.params.page;
    // Artist's on a single page
    var itemsPerPage =  6;

    Artists.find().sort('name').paginate(page,itemsPerPage, function(err, artists, total){
        if(err){
            res.status(500).send({message: "Server error"});
        }else{
            if(!artists){
                res.status(404).send({message: "Artists not found."});
            }else{
                res.status(200).send({
                    items_total: total,
                    artists: artists
                });
            }
        }

    });
}

function saveArtist(req, res){
    var artist = new Artists();
    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if(err){
            res.status(500).send({message: "Server error"});
        }else{
            if(!artistStored){
                res.status(404).send({message: "Artist wasn't saved"});
            }else{
                res.status(200).send({artist: artistStored});
            }
        }

    });
}

function updateArtist(req, res){
    // Get ID from URL
    var artistId = req.params.id;
    // POST Data
    var update = req.body;

    Artists.findByIdAndUpdate(artistId, update, (err, artistUpdated) =>{
        if(err){
            res.status(500).send({message:"Server error"});
        }else{
            if(!artistUpdated){
                res.status(404).send({message:"Artist wasn't updated"});
            }else{
                res.status(200).send({artist: artistUpdated});
            }
        }
    });
}

function deleteArtist(req, res){
    var artistId = req.params.id;

    Artists.findByIdAndDelete(artistId, (err, artistRemoved) => {
        if(err){
            res.status(500).send({message:"Server error"});
        }else{
            if(!artistRemoved){
                res.status(404).send({message:"Artist wasn't deleted"});
            }else{
                // ---- DELETE ON CASCADE -----

                //res.status(404).send({artistRemoved});
                // Delete all albums
                Album.find({artist: artistRemoved._id}).deleteOne((err, albumRemoved)=>{
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
                                    res.status(500).send({message:"Song cannot be deleted"});
                                }else{
                                    if(!songRemoved){
                                        res.status(404).send({message:"Song wasn't deleted"});
                                    }else{
                                        res.status(200).send({artist: artistRemoved});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

// Upload archives Method
function uploadImage(req, res){
    var artistId = req.params.id;
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
            Artists.findByIdAndUpdate(artistId, {image:file_name}, (err, artistUpdated) =>{
                if(err){
                    res.status(500).send({message:"Server Error: Error updating image"});
                }else{
                    if(!artistUpdated){
                        res.status(404).send({message:"Image cannot be uploaded"})
                    }else{
                        res.status(200).send({user:artistUpdated});
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

    var path_file = './uploads/artists/'+imageFile;

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
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};