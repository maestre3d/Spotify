import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist';
import { User } from '../models/user';

@Component({
    selector: 'app-artist-list',
    templateUrl: '../views/artist-list.html',
    providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit {
    public title: string;
    public artists: Artist[];
    public identity;
    public token;
    public url: string;
    public next_page;
    public prev_page;
    public confirmed;

    constructor(private _route: ActivatedRoute,
        private _router: Router, private _userService: UserService, private _artistService: ArtistService) {
        this.title = 'Artists';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.next_page = 1;
        this.prev_page = 1;
    }

    ngOnInit() {
        // Get artist list
        this.getArtists();
    }

    getArtists() {
        this._route.params.forEach((params: Params) => {
            // Convert to number with +
            let page = +params['page'];
            if (!page) {
                page = 1;
            } else {
                this.next_page = page + 1;
                this.prev_page = page - 1;

                if (this.prev_page === 0) {
                    this.prev_page = 1;
                }
            }

            this._artistService.getArtists(this.token, page).subscribe(
                response => {
                    if (!response.artists) {
                        this._router.navigate(['/']);
                    } else {
                        this.artists = response.artists;
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
        this._artistService.deleteArtist(this.token, id).subscribe(
            response => {
                this.getArtists();
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

