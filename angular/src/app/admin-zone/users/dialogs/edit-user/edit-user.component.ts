import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { FormGroup, FormControl} from '@angular/forms';

import{UsersService} from '../../users.service'
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'admin-zone-dialog-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {


  editUserForm: FormGroup;
  isLoading = false;
  private subscription: Subscription

  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    private usersService: UsersService, 
    @Inject(MAT_DIALOG_DATA) public  data: {email: string ,name:string , role: string, usersPerPage: number, currentPage:number}
  ) { 
  }


  ngOnInit() {
    this.editUserForm = new FormGroup({
      'role': new FormControl(this.data.role)
    });
  }

  exitEditUserDialog(){
    this.dialogRef.close()
  }


  onSubmit(){
    this.isLoading = true;
    const roleToUpdate = this.editUserForm.get('role').value;
    console.log("role to update = " , roleToUpdate);
    const updateUserObs: Observable<string>= this.usersService.updateUser(this.data.email, roleToUpdate);
    this.subscription = updateUserObs
      .subscribe(message => {
        this.isLoading = false;
        this.usersService.getUsers(this.data.usersPerPage , this.data.currentPage);
        this.exitEditUserDialog();
      }, err => {
        this.isLoading = false;
        this.exitEditUserDialog
      })
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    
  }
}
