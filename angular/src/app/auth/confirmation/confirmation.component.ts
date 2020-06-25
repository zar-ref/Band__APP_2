import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit, OnDestroy {

  private subscription : Subscription
  private isLoading = true; 
  private isRedirecting = false;
  constructor(public   authService: AuthService , private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    
    let emailToken;
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('emailToken')){
        emailToken = paramMap.get('emailToken');
        const confirmationObs : Observable<string> = this.authService.confirmation(emailToken);
        this.subscription = confirmationObs.subscribe(response => {
          this.isRedirecting = true
          setTimeout(()=> {
            this.isRedirecting= false
            this.isLoading = false
            // this.router.navigate(['/login'])
          } , 3000)
        }, err => {
          this.isLoading = false;
          // this.router.navigate(['/']);
        })
      }
    })
  }

  ngOnDestroy() {
    this.isLoading = false;
    this.isRedirecting = false;
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    
  }
 

}
