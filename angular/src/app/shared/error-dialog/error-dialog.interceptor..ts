import {
HttpInterceptor,
HttpRequest,
HttpHandler,
HttpErrorResponse
} from "@angular/common/http";
import { catchError, take } from "rxjs/operators";
import { throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";

import {ErrorDialogComponent}from './error-dialog.component'

@Injectable()
export class ErrorDialogInterceptor implements HttpInterceptor {

constructor(private dialog: MatDialog) {}

intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
            console.log("interceptor com erro = " ,error);
            let errorMessage = "Ocorreu um erro desconhecido!";
            if (error.error.message) {
            errorMessage = error.error.message;
            }
            this.dialog.open(ErrorDialogComponent, {data: {message: errorMessage}});
            return throwError(error);
        })
    );
}
}
