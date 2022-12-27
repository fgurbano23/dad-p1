import { Injectable } from '@angular/core';
import {lastValueFrom} from "rxjs";
import {environment} from "../../environment/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  constructor(private http: HttpClient) { }
  coinBalance(form: {node: string, coin_wallet: string}) {
    return lastValueFrom(this.http.post(environment.api + '/balance', form))
  }

  tokenBalance(tokenPublicKey: string) {
    return lastValueFrom(this.http.get(environment.api + `/wallet/${tokenPublicKey}/tokens`))
  }
}
