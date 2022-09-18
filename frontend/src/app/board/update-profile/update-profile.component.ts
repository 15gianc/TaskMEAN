import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';

import { Router, ActivatedRoute } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  registerData: any;
  message: string = '';
  _id: string;
  newPass: string;
  roles: Array<any>;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;

  constructor(private _userService: UserService,
    private _roleService: RoleService,
    private _router: Router,
    private _Arouter: ActivatedRoute,
    private _snackBar: MatSnackBar) {
      this.registerData = {};
    this._id = '';
    this.newPass = '';
    this.roles = [];
    
     }

  ngOnInit(): void {
  
      this._userService.findUserNew().subscribe(
        (res) => {
          this.registerData = res.userfind;
          this.registerData.password = this.newPass;
          console.log(this.registerData);
        },
        (err) => {
          this.message = err.error;
          this.openSnackBarError();
        }
      );
  }

  updateProfile() {
    if (!this.registerData.name || !this.registerData.email) {
      this.message = 'Failed process: Imcomplete data';
      this.openSnackBarError();
    } else {
      this._userService.updateUserNew(this.registerData).subscribe(
        (res) => {
          this._router.navigate(['/listTask']);
          this.message = 'Successfull edit user';
          this.openSnackBarSuccesfull();
          this.registerData = {};
        },
        (err) => {
          this.message = err.error;
          this.openSnackBarError();
        }
      );
    }
  }

  openSnackBarSuccesfull() {
    this._snackBar.open(this.message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
      panelClass: ['style-snackBarTrue'],
    });
  }

  openSnackBarError() {
    this._snackBar.open(this.message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
      panelClass: ['style-snackBarFalse'],
    });
  }

}