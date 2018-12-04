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
export class UploadService {
        // Save API URL
        public url: string;

        // Instance http
        constructor(private _http: Http) {
            this.url = GLOBAL.url;
        }

        // AJAX request
        makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string ) {

            // Launch output
            return new Promise(function (resolve, reject) {
                const formData: any = new FormData();
                const xhr = new XMLHttpRequest();

                for ( let i = 0; i < files.length; i++ ) {
                    formData.append(name, files[i], files[i].name);
                }

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve(JSON.parse(xhr.response));
                        } else {
                            reject(xhr.response);
                        }
                    }
                };

                xhr.open('POST', url, true);
                xhr.setRequestHeader('Authorization', token);
                xhr.send(formData);
            });
        }
}
