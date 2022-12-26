import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "src/environment/environment";
import {lastValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }


  login(form: any) {
    return lastValueFrom(this.http.post(environment.api + '/sign-in', form))
  }
}
