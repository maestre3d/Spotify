import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { GLOBAL } from '../services/global';

@Component({
    // Load tag
    selector: 'user-edit',
    // Load html
    templateUrl: '../views/user-edit.html',
    // Load service
    providers: [UserService]
})

export class UserEditComponent implements OnInit {
    public title: string;
    public user: User;
    public identity;
    public token;
    public alertMessage;
    public url: string;

    public filesToUpload: Array<File>;

    constructor(private _userService: UserService) {
        this.title = 'Edit profile';

        // Local Storage
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
    }

    ngOnInit() {

    }

    onSubmit() {

        this._userService.updateUser(this.user).subscribe(
            response => {
                if (!response.user) {
                    this.alertMessage = 'User cannot be updated';
                } else {
                    // this.user = response.user;
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    // Load new name
                    document.getElementById('navbarDropdown').innerHTML = this.user.name;
                    document.getElementById('identity_nameP').innerHTML = this.user.name + "'s profile";
                    // document.getElementById('identity_w').innerHTML = 'Welcome back, ' + this.user.name + ' ' + this.user.surname + '.';
                    if (!this.filesToUpload) {
                        // Redirect
                    } else {
                        this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload).then(
                            (result: any) => {
                                this.user.image = result.image;
                                localStorage.setItem('identity', JSON.stringify(this.user));
                                const image_path = this.url + 'get-image-user/' + this.user.image;

                                document.getElementById('#user_pic').setAttribute('src', image_path);
                                document.getElementById('#user_pic_nav').setAttribute('src', image_path);
                            }
                        );
                    }
                    this.alertMessage = this.user.name + ' updated.';
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

    fileChangeEvent(fileInput: any) {
        // Get selected archives
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    // AJAX request
    makeFileRequest(url: string, params: Array<string>, files: Array<File> ) {
        const token = this.token;

        // Launch output
        return new Promise(function (resolve, reject) {
            const formData: any = new FormData();
            const xhr = new XMLHttpRequest();

            for ( let i = 0; i < files.length; i++ ) {
                formData.append('image', files[i], files[i].name);
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
