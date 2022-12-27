import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const rqHeaders = request.headers

    let req = request.clone( {
      headers: rqHeaders
        .set('Content-Type', 'application/json')
    })

    const jwtToken = window.localStorage.getItem('token')
    if (jwtToken) {
      req = req.clone( {
        headers: req.headers
          .set( 'Authorization', `Bearer ${jwtToken}`)
      })
    }

    return next.handle(req);
  }
}
