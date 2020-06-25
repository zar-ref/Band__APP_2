import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormControl, FormGroup, Validators, AbstractControl  } from '@angular/forms';
import {AuthService} from '../auth.service'
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  private subscription : Subscription
  signUpForm: FormGroup;
  isLoading = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.signUpForm = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required]),
      'passwordConfirmation': new FormControl(null, [Validators.required])

    }, this.checkPasswords);
    

  }


  

  checkPasswords(group: FormGroup){ 
    const pass = group.get('password').value;
    const confirmPass = group.get('passwordConfirmation').value;

    if (pass && confirmPass){
      if(pass === confirmPass){
        return null;  
      }
      group.get('passwordConfirmation').setErrors({ notMatch: true });
    }

    
  }

  onSubmit(){
    this.isLoading = true;
    console.log(this.signUpForm);
    if(this.signUpForm.status === 'INVALID'){
      this.isLoading = false;
      return;
    }
    const email = this.signUpForm.get('email').value;
    const password = this.signUpForm.get('password').value;
    const name = this.signUpForm.get('name').value;
    const signUpObs : Observable<string> = this.authService.signUp(email,password,name);
    this.subscription = signUpObs.subscribe(response => {
      this.isLoading = false;
      console.log("response = " ,response)
    }, err => {
      this.isLoading = false;
      console.log("erro = " , err)
    })
  }

  ngOnDestroy(){
    this.isLoading = false;
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}