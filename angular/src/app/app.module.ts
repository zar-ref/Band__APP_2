import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {SharedModule} from './shared/shared.module'
import {MaterialModule} from './shared/material.module';
import {AuthModule} from './auth/auth.module';
// import {AdminZoneModule} from './admin-zone/admin-zone.module'
import {FanZoneModule} from './fan-zone/fan-zone.module';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ErrorDialogInterceptor } from './shared/error-dialog/error-dialog.interceptor.';
import { AuthInterceptor } from './auth/auth.interceptor';
import { LibraryComponent } from './library/library.component';





@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    LibraryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule,
    // AdminZoneModule,
    FanZoneModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorDialogInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
