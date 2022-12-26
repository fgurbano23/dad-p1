import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AmountCurrencyService} from "../services/amount-currency.service";
import jwt_decode from "jwt-decode";
@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent implements OnInit{

  form: FormGroup

  constructor(private fb: FormBuilder, private amountCurrency: AmountCurrencyService) {
    const userToken: string = window.localStorage.getItem('token') as string
    const jwt: any = jwt_decode(userToken)
    console.log(jwt)
    this.form = this.fb.group( {
      amount: [null, [Validators.required, Validators.required]],
      tokens: [0, [Validators.required, Validators.min(0)]],
      token_wallet: jwt?.token_public_key
    })


  }

  async ngOnInit() {
    try {
      const exchangeRate: any = await this.amountCurrency.exchangeRate();

      this.form.get('amount')?.valueChanges.subscribe(() => {
        const amount = this.form.get('amount')?.value
        this.form.get('tokens')?.setValue(this.amountCurrency.getConversion(amount,exchangeRate?.dollar,exchangeRate?.token));
      })


    } catch (e) {
      console.log()
    }
  }

  async submit() {
    try {
      const res = await this.amountCurrency.buyTokens( this.form.value)
      console.log(res)
    } catch (e) {
    }
  }
}
