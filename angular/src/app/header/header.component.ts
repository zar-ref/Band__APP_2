import { Component, OnInit, OnDestroy } from '@angular/core';
import {AuthService} from '../auth/auth.service'
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {


  private userSub: Subscription;
  userIsAuthenticated = false;
  isAdmin = false;

  constructor(private authService: AuthService ) { }

  ngOnInit() {


    this.userSub = this.authService.user
      .subscribe(user => {
        console.log("no header com user = ",user);
        if(user){
          this.userIsAuthenticated = true;
          if(user.role === "admin"){
            this.isAdmin = true;
          }
        }
        else {
          this.userIsAuthenticated = false;
          this.isAdmin = false;
        }

      })

  }
  
  onLogout(){
    this.isAdmin= false
    this.authService.logout()
   
  }
  
  ngOnDestroy(){
      if(this.userSub){
        this.userSub.unsubscribe();
      }
    }
}
