'use strict'

// Load path and filesystem libs
var path = require('path');
var fs = require('fs');

// Get schemes
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

var mongoosePaginate = require('mongoose-pagination');

function getSong(req, res){
    var songId = req.params.id;
    
    Song.findById(songId).populate({path: 'album'}).exec((err, song)=>{
        if(err){
            res.status(500).send({message: "Petition Error"});
        }else{
            if(!song){
                res.status(404).send({message: "Song doesn't exist"});
            }else{
                res.status(200).send({song});
            }
        }
    });
}

function getSongs(req, res){
    var albumId = req.params.album;

    if(!albumId){
        var find = Song.find({}).sort('number');
    }else{
        var find = Song.find({album: albumId}).sort('number');
    }

    // Populate multiple items
    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs)=>{
        if(err){
            res.status(500).send({message: "Server Error"});
        }else{
            if(!songs){
                res.status(404).send({message: "No songs found"});
            }else{
                res.status(200).send({songs});
            }
        }
    });
}

function saveSong(req, res){
    var song = new Song();
    var params = req.body;

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;

    song.save((err, songStored)=>{
        if(err){
            res.status(500).send({message: "Server Error"});
        }else{
            if(!songStored){
                res.status(404).send({message: "Song cannot be saved"});
            }else{
                res.status(200).send({song: songStored});
            }
        }
    });
}

function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, updatedSong)=>{
        if(err){
            res.status(500).send({message: "Server Error"});
        }else{
            if(!updatedSong){
                res.status(404).send({message: "Song cannot be udpated"});
            }else{
                res.status(200).send({song: updatedSong});
            }
        }
    });
}

function deleteSong(req, res){
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songDeleted)=>{
        if(err){
            res.status(500).send({message: "Server Error"});
        }else{
            if(!songDeleted){
                res.status(404).send({message: "Song cannot be deleted"});
            }else{
                res.status(200).send({song: songDeleted});
            }
        }
    });
}

function uploadFile(req, res){
    var songId = req.params.id;
    var file_name = 'Not uploaded';

    // If theres existing data through files
    if(req.files){
        // Get file's path
        var file_path = req.files.file.path;
        // Cut file's path
        var file_split = file_path.split('\\');
        // Separate path into an array
        var file_name = file_split[2];

        // Verify if it is an image
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'mp3' || file_ext == 'aac' || file_ext == 'ogg'){
            // add image path to DB
            Song.findByIdAndUpdate(songId, {file:file_name}, (err, songUpdated) =>{
                if(err){
                    res.status(500).send({message:"Server Error"});
                }else{
                    if(!songUpdated){
                        res.status(404).send({message:"File cannot be uploaded"})
                    }else{
                        res.status(200).send({song:songUpdated});
                    }
                }
            });
        }else{
            res.status(200).send({message:"Audio format not valid"});
        }

        //console.log(file_split);
        //res.status(200).send({message:file_path});
    }else{
        res.status(200).send({message:"File not uploaded"});
    }
}

function getSongFile(req, res){
    // Get image file from POST
    var songFile = req.params.songFile;

    var path_file = './uploads/songs/'+songFile;

    // Verify if file exists
    fs.exists(path_file, function(exists){
        // Verify if callback's param is correct
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message:"File not found"});
        }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
};