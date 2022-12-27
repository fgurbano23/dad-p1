import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from "rxjs/operators";
import {LoginService} from "../services/login.service";
import {ToastService} from "../services/toast.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService, private toast :ToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!(error.error instanceof ErrorEvent)) {
          if (error.status == 401){
            this.loginService.logout();
            this.toast.show('Se ha expirado su sesión',{ classname: 'bg-info text-light', delay: 10000 })
          }
        }
        return throwError(error);
      }))
  }
}
