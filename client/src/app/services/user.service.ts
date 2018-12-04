// Angular module
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
// Map objects
import { map } from 'rxjs/operators/';
// Get ajax request to server
// Angular 6
import { Observable } from 'rxjs/Observable';
// Import global URL from file
import { GLOBAL } from './global';

// Define decorator
// Inject dependecies
@Injectable()
export class UserService {
    // Save API URL
    public url: string;
    public identity;
    public token;

    // Instance http
    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    // Test method
    // usertologin = user's log
    // gethash = Optional / API REST gets hash Token
    signup(user_to_login, gethash = null) {
        if (gethash != null) {
            user_to_login.gethash = gethash;
        }
        const json = JSON.stringify(user_to_login);
        const params = json;

        // Only if Server is coded on JS
        const headers = new Headers({'Content-Type': 'application/json'});
        // Get into API
        // Map response into JSON object
        return this._http.post(this.url + 'login', params, {headers: headers})
        .pipe(map(res => res.json()));
    }

    register(user_to_register) {
        const json = JSON.stringify(user_to_register);
        const params = json;

        // Only if Server is coded on JS
        const headers = new Headers({'Content-Type': 'application/json'});
        // Get into API
        // Map response into JSON object
        return this._http.post(this.url + 'register', params, {headers: headers})
        .pipe(map(res => res.json()));
    }

    updateUser(user_to_update) {
        const json = JSON.stringify(user_to_update);
        const params = json;

        // Only if Server is coded on JS
        const headers = new Headers({'Content-Type': 'application/json', 'Authorization': this.getToken()});
        // Get into API
        // Map response into JSON object
        return this._http.put(this.url + 'update-user/' + user_to_update._id, params, {headers: headers})
        .pipe(map(res => res.json()));
    }

    getIdentity() {
        const identity = JSON.parse(localStorage.getItem('identity'));

        if (identity !== 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }

        return this.identity;
    }

    getToken() {
        const token = localStorage.getItem('token');

        if (token !== 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }

        return this.token;
    }
}

