// Angular module
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
// Map objects
import { map } from 'rxjs/operators/';
// Get ajax request to server
// Angular 6
import { Observable } from 'rxjs/Observable';
// Import global URL from file
import { GLOBAL } from './global';
import { Artist } from '../models/artist';

// Define decorator
// Inject dependecies
@Injectable()
export class ArtistService {
        // Save API URL
        public url: string;

        // Instance http
        constructor(private _http: Http) {
            this.url = GLOBAL.url;
        }

        getArtists(token, page) {
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': token
            });
            const options = new RequestOptions({headers: headers});

            return this._http.get(this.url + 'artists/' + page, options)
                .pipe(map(res => res.json()));
        }

        getArtist(token, id: string) {
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': token
            });
            const options = new RequestOptions({headers: headers});

            return this._http.get(this.url + 'artist/' + id, options)
                .pipe(map(res => res.json()));
        }

        addArtist(token, artist: Artist) {
            const params = JSON.stringify(artist);
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': token
            });

            return this._http.post(this.url + 'artist', params, {headers: headers})
                            .pipe(map(res => res.json()));
        }

        editArtist(token, id: string, artist: Artist) {
            const params = JSON.stringify(artist);
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': token
            });

            return this._http.put(this.url + 'artist/' + id, params, {headers: headers})
                            .pipe(map(res => res.json()));
        }

        deleteArtist(token, id: string) {
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': token
            });
            const options = new RequestOptions({headers: headers});

            return this._http.delete(this.url + 'artist/' + id, options)
                .pipe(map(res => res.json()));
        }
}
