import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { MainComponent } from './main/main.component'
import { FanZoneComponent } from './fan-zone/fan-zone.component'
import {AdminZoneComponent } from './admin-zone/admin-zone.component'
import {ConfirmationComponent} from './auth/confirmation/confirmation.component'
import {AdminGuard} from './auth/admin.guard'
import  {AuthTwiceGuard} from './auth/auth-twice.guard'
import{AuthGuard} from './auth/auth-guard';
import {AdminZoneModule} from './admin-zone/admin-zone.module'
import{LibraryComponent} from './library/library.component'

const routes: Routes = [

  {path: '', component: MainComponent},
  {path: 'login' , component: LoginComponent , canActivate: [AuthTwiceGuard] },
  {path: 'signup' , component: SignupComponent , canActivate: [AuthTwiceGuard]},
  {path: 'fan-zone' , component: FanZoneComponent , canActivate: [AuthGuard]},
  {path: 'library' , component: LibraryComponent},   
  {path: 'admin-zone' , loadChildren: ()=> import('./admin-zone/admin-zone.module').then(m => m.AdminZoneModule) ,  canActivate: [AdminGuard]}, 

  {path: 'confirmation/:emailToken' , component: ConfirmationComponent},
  {path: 'confirmation' , component: MainComponent}



];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
