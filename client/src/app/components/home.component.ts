import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-home',
    templateUrl: '../views/home.html',
    providers: [UserService]
})
export class HomeComponent implements OnInit {
    public title: string;
    public identity;
    public token;
    public url: string;

    constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService) {
        this.title = 'Home';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {

    }
}
