import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';

import{UsersService} from '../../users.service'
import { Subscription, Observable } from 'rxjs';


@Component({
  selector: 'admin-zone-users-dialogs-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit , OnDestroy{

  private subscription: Subscription
  public isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    private usersService: UsersService, 
    @Inject(MAT_DIALOG_DATA) public data: {email: string , name: string , usersPerPage: number, currentPage:number}
  ) { 
  }

  ngOnInit() {

  }

  exitDeleteUserDialog(){
    this.dialogRef.close()
  }

  deleteUser(email:string){
    this.isLoading=true;
    const deleteUserObs: Observable<string>=  this.usersService.deleteUser(email);
    this.subscription = deleteUserObs
      .subscribe(message => {
        this.isLoading = false;
        this.usersService.getUsers(this.data.usersPerPage, this.data.currentPage);
        this.exitDeleteUserDialog();
      }, err => {
        this.isLoading = false;
        this.exitDeleteUserDialog();

      })
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    
  }

}
