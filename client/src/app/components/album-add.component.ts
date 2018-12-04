import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
    selector: 'app-album-add',
    templateUrl: '../views/album-add.html',
    providers: [UserService, ArtistService, AlbumService]
})

export class AlbumAddComponent implements OnInit {
    public pTitle: string;
    public artist: Artist;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService) {

        this.pTitle = 'Create album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '', '');
        this.album = new Album('', '', 2015, '', '');
    }

    ngOnInit() {
    }

    onSubmit() {
        this._route.params.forEach((params: Params) => {
            const artist_id = params['artist'];
            this.album.artist = artist_id;

            this._albumService.addAlbum(this.token, this.album).subscribe(
                response => {
                    if (!response.album) {
                        this.alertMessage = 'Server Error';
                    } else {
                        this.album = response.album;
                        this.alertMessage = 'Album created.';
                        this._router.navigate(['/edit-album', response.album._id]);
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

        });
    }
}
