import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler
  } from "@angular/common/http";
  import { Injectable } from "@angular/core";
  
  import { AuthService } from "./auth.service";
import { take, exhaustMap } from 'rxjs/operators';
  
  @Injectable()
  export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}
  
    intercept(req: HttpRequest<any>, next: HttpHandler) {
      return this.authService.user.pipe(
          take(1),
          exhaustMap(user => { //exhaust map vai esperar que o observable do user acabe (esperar pelo ultimo valor de user). Depois o argumento user será o resultado do primeiro Observable(do take(1)). Finalmente retorna outro Observable (que está no interior da função) que substitui o anterior.
            let authToken;
            if(user === null){
              authToken = ""
            }
            else {
              authToken = user.token;
            }
            const authRequest = req.clone({
            headers: req.headers.set("Authorization", "Bearer " + authToken)
            });
            return next.handle(authRequest);

        })
      );
      
  }
}
