import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'app-artist-detail',
    templateUrl: '../views/artist-detail.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class ArtistDetailComponent implements OnInit {
    public title: string;
    public artist: Artist;
    public albums: Album[];
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public id_a: string;
    public noAlbum;
    public confirmed;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService) {

        this.title = 'Edit Artist';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.noAlbum = false;
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

                         // Get artist's album
                         this._albumService.getAlbums(this.token, response.artist._id).subscribe(
                             response => {
                                if (!response.albums) {
                                    this.alertMessage = 'This artist doesnt has albums';
                                } else {
                                    if (response.albums.length === 0) {
                                        this.albums = null;
                                        this.noAlbum = true;
                                        this.alertMessage = 'This artist doesnt has albums';
                                    } else {
                                        this.albums = response.albums;
                                        console.log(this.albums);
                                    }
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

    onDeleteConfirm(id) {
        this.confirmed = id;
    }

    onCancel() {
        this.confirmed = null;
    }

    onDeleteArtist(id) {
        this._albumService.deleteAlbum(this.token, id).subscribe(
            response => {
                this.getArtist();
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
    }



}

