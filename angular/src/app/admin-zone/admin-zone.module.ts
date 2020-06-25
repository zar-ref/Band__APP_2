import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminZoneComponent } from './admin-zone.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { ErrorDialogInterceptor } from '../shared/error-dialog/error-dialog.interceptor.';
import { UsersComponent } from './users/users.component';
// import { AlbunsComponent } from './albuns/albuns.component';
// import { CreateComponent } from './albuns/create/create.component';
// import { EditComponent } from './albuns/edit/edit.component';
import { LibraryComponent } from './library/library.component';
import { AdminZoneRoutingModule } from './admin-zone-routing.module';
import {DeleteUserComponent} from './users/dialogs/delete-user/delete-user.component'
import{EditUserComponent} from './users/dialogs/edit-user/edit-user.component'
import {AddBookComponent} from './library/dialogs/add-book/add-book.component'
import {EditBookComponent} from './library/dialogs/edit-book/edit-book.component'
import{DeleteBookComponent} from './library/dialogs/delete-book/delete-book.component'

@NgModule({
    declarations: [   
        AdminZoneComponent, 
        UsersComponent, 
        DeleteUserComponent,
        EditUserComponent,
        LibraryComponent,
        AddBookComponent,
        EditBookComponent,
        DeleteBookComponent
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        AdminZoneRoutingModule
    ],
    providers: [],
    entryComponents: [
        DeleteUserComponent,
        EditUserComponent,
        AddBookComponent,
        EditBookComponent,
        DeleteBookComponent

      ]
  })
  export class AdminZoneModule { }