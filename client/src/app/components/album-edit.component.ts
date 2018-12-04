import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'app-album-edit',
    templateUrl: '../views/album-add.html',
    providers: [UserService, AlbumService, UploadService]
})

export class AlbumEditComponent implements OnInit {
    public pTitle: string;
    public artist: Artist;
    public album: Album;
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
        private _albumService: AlbumService,
        private _uploadService: UploadService) {

        this.pTitle = 'Edit album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', 2015, '', '');
        this.is_edit = true;
    }

    ngOnInit() {
        this.getAlbum();
    }

    onSubmit() {
        this._albumService.editAlbum(this.token, this.id_a, this.album).subscribe(
            response => {
                if (!response.album) {
                    this.alertMessage = 'Server Error';
                } else {
                    this.alertMessage = 'Album ' + this.album.title + ' edited.';
                    if (!this.filesToUpload) {
                        this._router.navigate(['/artist', response.album.artist]);
                    } else {
                        this._uploadService.makeFileRequest(this.url + 'upload-image-album/' + this.id_a,
                        [], this.filesToUpload, this.token, 'image').then(
                            (result) => {
                                this._router.navigate(['/artist', response.album.artist]);
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

    getAlbum() {
        this._route.params.forEach((params: Params) => {
            const id = params['id'];
            this.id_a = id;

            this._albumService.getAlbum(this.token, this.id_a ).subscribe(
                response => {
                    if (!response.album) {
                        this._router.navigate(['/']);
                    } else {
                        this.album = response.album;

                         // Get artist's album
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
}
