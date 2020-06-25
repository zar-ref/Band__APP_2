import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { AdminZoneComponent } from './admin-zone.component'
import { AdminGuard } from '../auth/admin.guard';
import { UsersComponent } from './users/users.component';
import { AlbunsComponent } from './albuns/albuns.component';
import { LibraryComponent } from './library/library.component';
import {AlbunsRoutingModule} from './albuns/albuns-routing.module'
import {AlbunsModule} from './albuns/albuns.module'

const routes: Routes = [

  
  {path: '' , component: AdminZoneComponent ,
    children: [        
        {path: 'users' , component: UsersComponent},
        {path: 'albuns' , loadChildren: ()=> import('./albuns/albuns.module').then(m => m.AlbunsModule)},        
        {path: 'library' , component: LibraryComponent},
        {path: '' , redirectTo: 'users', pathMatch: 'full'}
    ]

}


];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminZoneRoutingModule { }
