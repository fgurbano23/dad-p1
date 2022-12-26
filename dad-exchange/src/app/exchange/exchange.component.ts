import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AmountCurrencyService} from "../services/amount-currency.service";
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit{
  form: FormGroup

  currencyList: Array<string> =  []
  constructor(
    private fb: FormBuilder,
    private amountCurrency: AmountCurrencyService) {

    const userToken: string = window.localStorage.getItem('token') as string
    const jwt: any = jwt_decode(userToken)
    console.log(jwt)

    this.form = this.fb.group( {
      amount: [null, [Validators.required, Validators.required]],
      fromCurrency: [null, [Validators.required, Validators.min(0)]],
      toCurrency: [null, [Validators.required, Validators.min(0)]],
      receive: [0, [Validators.required, Validators.required]],
      token_wallet: jwt?.token_public_key,
      coin_wallet: jwt?.wallet_public_key
    })
  }

  async ngOnInit(){
    try {
      const exchangeRate: any = await this.amountCurrency.exchangeRate();
      this.currencyList = Object.keys(exchangeRate);
      console.log(this.currencyList)
    } catch (e) {
      console.log(e)
    }

  }

  getFromCurrency() {
    return this.currencyList.filter((item) => item != 'dollar')
  }

  getToCurrency() {
    return this.currencyList.filter((item) => item != this.form.value.fromCurrency)
  }
  submit() {}
}
