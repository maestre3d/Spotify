import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';
import { User } from '../models/user';

@Component({
    selector: 'app-artist-add',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService]
})

export class ArtistAddComponent implements OnInit {
    public title: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService) {

        this.title = 'Add Artist';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '', '');
    }

    ngOnInit() {
        // Get artist list
    }

    onSubmit() {
        this._artistService.addArtist(this.token, this.artist).subscribe(
            response => {
                if (!response.artist) {
                    this.alertMessage = 'Server Error';
                } else {
                    this.artist = response.artist;
                    this.alertMessage = 'Artist created.';
                    this._router.navigate(['/edit-artist', response.artist._id]);
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
}

