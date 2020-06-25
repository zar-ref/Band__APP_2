import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FanZoneComponent} from './fan-zone.component'
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorDialogInterceptor } from '../shared/error-dialog/error-dialog.interceptor.';


@NgModule({
    declarations: [ 
        FanZoneComponent
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        SharedModule
    ],
    providers: []
  })
  export class FanZoneModule { }