import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from './services/user.service';
import { User } from './models/user';
import { GLOBAL } from './services/global';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
  // styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  // Components
  public title = 'Spotify';
  public user: User;
  public user_register: User;
  // Get logged user's obj
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url: string;
  public editUser: boolean;

  constructor(
    private _route: ActivatedRoute, private _router: Router,
    private _userService: UserService
  ) {
    // ID, name, surname, email, pass, role, img
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url = GLOBAL.url;
    this.editUser = false;

  }

  // Load code when Init
  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  public onSubmit() {
    console.log(this.user);

    // Suscribe to Observable
    // Get logged user's data
    this._userService.signup(this.user).subscribe(
      response => {
        console.log(response);
        // Get res user from POST response
        const identity = response.user;
        this.identity = identity;

        // If ID is not correct
        if (!this.identity._id) {
          alert('Server Error');
        } else {
          // Create localstorage to get user's session
          localStorage.setItem('identity', JSON.stringify(identity));
          // Get token to send every htttp petition

          this._userService.signup(this.user, 'true').subscribe(
            response => {
              console.log(response);
              // Get res user from POST response
              const token = response.token;
              this.token = token;
              // If ID is not correct
              if (this.token.length <= 0) {
                alert('Token cannot be generated');
              } else {
                // Create localstorage to get user's token
                localStorage.setItem('token', token);
                // Get token to send every htttp petition
                /*console.log(token);
                console.log(identity);*/
                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
              }
            },
            error => {
              const errorMessage = <any>error;
              if (errorMessage != null) {
                const body = JSON.parse(error._body);
                this.errorMessage = body.message;
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
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );
  }

  logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();

    this.identity = null;
    this.token = null;
    this.editUser = false;
    this._router.navigate(['/']);
  }

  onSubmitSign() {
    console.log(this.user_register);

    this._userService.register(this.user_register).subscribe(
      response => {
        const user = response.user;
        this.user_register = user;

        if (!user._id) {
          this.alertRegister = 'Cannot Sign Up';
        } else {
          this.alertRegister = 'Sign up successful. You can now log in.(' + this.user_register.email + ')';
          this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      error => {
        const errorMessage = <any>error;
        if (errorMessage != null) {
          const body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );
  }

  public onEditUser() {
    if ( this.editUser === false ) {
      this.editUser = true;
    } else {
      this.editUser = false;
    }
  }
}
