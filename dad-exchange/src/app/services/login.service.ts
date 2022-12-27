import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "src/environment/environment";
import {lastValueFrom} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router) { }


  login(form: any) {
    return lastValueFrom(this.http.post(environment.api + '/sign-in', form))
  }

  logout() {
    window.localStorage.clear()
    this.router.navigate(['/sign-in'])
  }
}
