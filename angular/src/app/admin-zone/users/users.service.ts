import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import {  throwError, Subject, BehaviorSubject} from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';



export interface UserData {
    email: string,
    name: string,
    date: Date,
    role: string,
}



@Injectable({providedIn: "root"})
export class UsersService {

    users= new BehaviorSubject<{ usersData : UserData[] , usersCount: number}> (null);
    
    constructor(  private http: HttpClient, private router: Router){}

    getUsers(usersPerPage: number, currentPage: number){
        const queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;

        this.http.get<{ usersData : UserData[] , usersCount: number}>(environment.webRestUrl + 'admin-zone/users/users' + queryParams)
            .pipe(
                catchError(this.handleError),
                map(usersInfo => {
                    return  { 
                        users: usersInfo.usersData,
                        usersCount: usersInfo.usersCount
                    }
                })            
            ).subscribe(transformedData => {
                this.users.next({
                    usersData: transformedData.users,
                    usersCount: transformedData.usersCount
                })
            });
    }

    

    deleteUser(userEmail: string){
        const queryParams = `?usertodelete=${userEmail}`;
        return this.http.delete<string>(environment.webRestUrl + 'admin-zone/users/delete-user' + queryParams)
            .pipe( catchError(this.handleError) )
    }

    updateUser(userEmail: string, roleToUpdate: string){
        return this.http.put<string>(environment.webRestUrl + 'admin-zone/users/update-user-type', {userEmail: userEmail, roleToUpdate: roleToUpdate})
        .pipe(
            catchError(this.handleError)
        )
    }
    
     handleError(errorRes: HttpErrorResponse){
        console.log(errorRes)
        let errorMessage = errorRes.error.message;
        return throwError(errorMessage);

    }
}