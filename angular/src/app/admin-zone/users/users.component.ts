import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UsersService, UserData } from './users.service';
import { Subscription, Observable } from 'rxjs';
import { PageEvent, MatDialog } from "@angular/material";
import {DeleteUserComponent} from './dialogs/delete-user/delete-user.component'
import { EditUserComponent } from './dialogs/edit-user/edit-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  private isLoading = false;
  private users: UserData[] = [];
  private usersInfoSub: Subscription;
  private usersColumnsToDisplay = ['email', 'name', 'date' , 'role' ,'action'];
  totalUsers = 0;
  usersPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [ 2, 5, 10];
  previousPage = 0;



  constructor(private usersService: UsersService, private matDialog:MatDialog ,) { }

  ngOnInit() {
    this.isLoading = true;
    this.usersService.getUsers(this.usersPerPage,this.currentPage);
    this.usersInfoSub = this.usersService.users
      .subscribe(usersInfo => {
        this.isLoading = true;
        if(usersInfo) {
          this.users = usersInfo.usersData;
          this.totalUsers = usersInfo.usersCount;
          this.isLoading = false
        }else {
          this.isLoading = false
        }
       
      })
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    console.log("page data = " ,pageData)
    this.currentPage = pageData.pageIndex + 1;
    console.log("current page =" , this.currentPage);
    this.usersPerPage = pageData.pageSize;
    this.usersService.getUsers(this.usersPerPage,this.currentPage);
  }

  showDeleteUserDialog(email:string, name:string, usersPerPage: number, currentPage:number){
    const dialogRef = this.matDialog.open( DeleteUserComponent, {
      width: '350px',
      height: '350px',
      data: {email: email ,name:name , usersPerPage: usersPerPage, currentPage: currentPage}
    });
  }

  showEditUserDialog(email:string, name:string, role:string, usersPerPage: number, currentPage:number){
    const dialogRef = this.matDialog.open( EditUserComponent, {
      width: '350px',
      height: '350px',
      data: {email: email , name: name, role: role , usersPerPage: usersPerPage, currentPage: currentPage}
    });
  }

  ngOnDestroy(){
    this.usersInfoSub.unsubscribe();
  }
}
