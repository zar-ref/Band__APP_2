import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormControl, FormGroup, Validators  } from '@angular/forms';
import {AuthService} from '../auth.service'
import { Subscription, Observable } from 'rxjs';
import {ResponseAuthData} from '../auth-data.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {


  loginForm: FormGroup;
  isLoading = false;
  private subscription: Subscription
  constructor(private authService: AuthService, private router: Router ) { }

  ngOnInit() {

    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    console.log(this.loginForm.status);
    this.isLoading = true;
    if(this.loginForm.status === 'INVALID'){
      return;
    }

    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    const loginObs: Observable<ResponseAuthData> = this.authService.login(email, password);
    this.subscription = loginObs.subscribe(response => {
      this.isLoading = false;
      if(response.role === "admin"){
        this.router.navigate(['/admin-zone']);
      }
      else {
        this.router.navigate(['/fan-zone']);
      }
      
    }, err => {
      console.log(err);
      this.isLoading = false;
      this.loginForm.reset();
    })    
  }

  ngOnDestroy() {
    this.isLoading = false;
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    
  }

}
