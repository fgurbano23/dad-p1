import { Injectable } from '@angular/core';
import {lastValueFrom} from "rxjs";
import {environment} from "../../environment/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AmountCurrencyService {

  constructor(private http: HttpClient) { }

  getConversion(amount: number,srcRate: number, targetRate: number) {
    if (!amount ||
      !srcRate ||
    !targetRate) {
      return 0
    }
    return amount *  targetRate / srcRate ;
  }

  exchangeRate() {
    return lastValueFrom(this.http.get(environment.api + `/exchange-rate`))
  }

  buyTokens(form: any) {
    return lastValueFrom(this.http.post(environment.api + `/tokens`, form ))
  }

  exchange(form: any) {
    return lastValueFrom(this.http.post(environment.api + `/exchange`, form ))
  }

  getBeneficiaries() {
    return lastValueFrom(this.http.get(environment.api + `/beneficiaries`))
  }

  transfer(form: any) {
    return lastValueFrom(this.http.post(environment.api + `/transfer`, form ))
  }

}
