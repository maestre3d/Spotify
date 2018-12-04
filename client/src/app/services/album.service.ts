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
import { Album } from '../models/album';

// Define decorator
// Inject dependecies
@Injectable()
export class AlbumService {
        // Save API URL
        public url: string;

        // Instance http
        constructor(private _http: Http) {
            this.url = GLOBAL.url;
        }

        addAlbum(token, album: Album) {
            const params = JSON.stringify(album);
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': token
            });

            return this._http.post(this.url + 'album', params, {headers: headers})
                            .pipe(map(res => res.json()));
        }

        editAlbum(token, id: string ,album: Album) {
            const params = JSON.stringify(album);
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': token
            });

            return this._http.put(this.url + 'album/' + id, params, {headers: headers})
                            .pipe(map(res => res.json()));
        }

        getAlbum(token, id: string) {
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': token
            });
            const options = new RequestOptions({headers: headers});

            return this._http.get(this.url + 'album/' + id, options)
                .pipe(map(res => res.json()));
        }

        getAlbums(token, artistId = null) {
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': token
            });
            const options = new RequestOptions({headers: headers});

            if (artistId == null) {
                return this._http.get(this.url + 'albums', options)
                .pipe(map(res => res.json()));
            } else {
                return this._http.get(this.url + 'albums/' + artistId, options)
                .pipe(map(res => res.json()));
            }
        }

        deleteAlbum(token, id: string) {
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': token
            });
            const options = new RequestOptions({headers: headers});

            return this._http.delete(this.url + 'album/' + id, options)
                .pipe(map(res => res.json()));
        }
}
