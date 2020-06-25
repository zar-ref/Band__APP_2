import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from './material.module'
import {ErrorDialogComponent} from './error-dialog/error-dialog.component'
// import {ErrorDialogInterceptor} from './error-dialog/error-dialog.interceptor.'
import {cutMusicFilename} from './pipes/cut-music-filename.pipe'
@NgModule({
  declarations: [
    ErrorDialogComponent,
    cutMusicFilename
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],    
  exports: [    
    CommonModule,
    MaterialModule,
    ErrorDialogComponent,
    cutMusicFilename
  ],
  entryComponents: [
    ErrorDialogComponent
  ]
})
export class SharedModule {}
