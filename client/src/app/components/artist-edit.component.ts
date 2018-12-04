import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { UploadService } from '../services/upload.service';
import { Artist } from '../models/artist';
import { User } from '../models/user';

@Component({
    selector: 'app-artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit {
    public title: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit;
    public id_a: string;
    public filesToUpload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _uploadService: UploadService) {

        this.title = 'Edit Artist';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '', '');
        this.is_edit = true;
    }

    ngOnInit() {
        // Get artist list
        this.getArtist();
    }

    getArtist() {
        this._route.params.forEach((params: Params) => {
            const id = params['id'];
            this.id_a = id;
            this._artistService.getArtist(this.token, id).subscribe(
                response => {
                    if (!response.artist) {
                        this._router.navigate(['/']);
                    } else {
                        this.artist = response.artist;
                    }
                },
                error => {
                    const errorMessage = <any>error;
                    if (errorMessage != null) {
                      const body = JSON.parse(error._body);
                      // this.alertMessage = body.message;
                      console.log(error);
                    }
                }
            );
        });
    }

    onSubmit() {
        this._artistService.editArtist(this.token, this.id_a, this.artist).subscribe(
            response => {
                if (!response.artist) {
                    this.alertMessage = 'Server Error';
                } else {
                    // this.artist = response.artist;
                    this.alertMessage = 'Artist ' + this.artist.name + ' edited.';
                    // this._router.navigate(['/edit-artist'], response.artist._id);
                    if (!this.filesToUpload) {
                        this._router.navigate(['/artist', response.artist._id]);
                    } else {
                        this._uploadService.makeFileRequest(this.url + 'upload-image-artist/' + this.id_a,
                        [], this.filesToUpload, this.token, 'image').then(
                            (result) => {
                                this._router.navigate(['/artist', response.artist._id]);
                            },
                            (error) => {
                                console.log(error);
                            }
                        );
                    }
                }
            },
            error => {
                const errorMessage = <any>error;
                if (errorMessage != null) {
                  const body = JSON.parse(error._body);
                  this.alertMessage = body.message;
                  console.log(error);
                }
            }
        );
    }

    fileChangeEvent(fileInput: any) {
        // Get selected archives
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

}

