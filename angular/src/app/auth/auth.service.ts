import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthData , ResponseAuthData, SignUpData } from './auth-data.model';
// import { SignUpData } from './signup-data.model';
import {User} from './user.model';
import {environment} from '../../environments/environment'
import { catchError, tap } from 'rxjs/operators';

import {  throwError, BehaviorSubject} from 'rxjs';
import { Router } from '@angular/router';




@Injectable({providedIn: "root"})
export class AuthService {



    // private user = new Subject<User>();
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;
    
    constructor(  private http: HttpClient, private router: Router){}




    login(email: string, password: string) {
        const authData: AuthData = {email: email, password: password};
        console.log("auth Data" , authData);
        return this.http.post<ResponseAuthData>(environment.webRestUrl + 'auth/login' , authData)
            .pipe(
                catchError( this.handleError),
                tap(response => {
                    console.log(response);
                    const expirationDate = new Date(new Date().getTime() + response._tokenExpirationDate);
                    const user = new User(response.email, response.role, response.name, response._token, expirationDate);
                    this.user.next(user);
                    this.autoLogout(response._tokenExpirationDate);
                    localStorage.setItem('userData', JSON.stringify(user));
                })
            )
    }

    autoLogin() {
        const userData: {
            email: string,
            role: string,
            name: string,
            _token:string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        console.log("user data = ", userData);
        if (!userData) {
          return;
        }
    
        const loadedUser = new User(
          userData.email,
          userData.role,
          userData.name,          
          userData._token,
          new Date(userData._tokenExpirationDate)
        );
        
        if (loadedUser.token) {
          this.user.next(loadedUser);
          console.log("no auth service com auto login");
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.autoLogout(expirationDuration);
        }
      }
    

    signUp(email:string, password: string, name:string){
        const signUpData: SignUpData = {email:email, password: password, name: name};
        return this.http.post<string>(environment.webRestUrl + 'auth/signup', signUpData)
            .pipe(
                catchError(this.handleError)
            )

    }

    confirmation(emailToken:string){
        return this.http.put<string>(environment.webRestUrl + 'auth/confirmation', {emailToken: emailToken})
            .pipe(
                catchError(this.handleError),
                tap(response => {
                    console.log("auth service", response)
                })
            )
    }



    logout(){
        this.user.next(null);
        this.router.navigate(['/']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;

    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
          this.logout();
        }, expirationDuration);
    }

    handleError(errorRes: HttpErrorResponse){
        console.log(errorRes)
        let errorMessage = errorRes.error.message;
        return throwError(errorMessage);

    }

}