import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ConfirmationComponent } from './confirmation/confirmation.component'
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorDialogInterceptor } from '../shared/error-dialog/error-dialog.interceptor.';

@NgModule({
    declarations: [        
        LoginComponent,
        SignupComponent,
        ConfirmationComponent
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        SharedModule
    ],
    providers: []
  })
  export class AuthModule { }