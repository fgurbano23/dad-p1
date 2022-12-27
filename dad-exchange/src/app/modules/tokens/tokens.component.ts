import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AmountCurrencyService} from "../../services/amount-currency.service";
import jwt_decode from "jwt-decode";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastService} from "../../services/toast.service";
@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent implements OnInit{

  form: FormGroup

  constructor(private fb: FormBuilder, private amountCurrency: AmountCurrencyService, private toast:ToastService) {
    const userToken: string = window.localStorage.getItem('token') as string
    const jwt: any = jwt_decode(userToken)
    console.log(jwt)
    this.form = this.fb.group( {
      amount: [null, [Validators.required, Validators.min(1)]],
      tokens: [0, [Validators.required, Validators.min(1), Validators.max(10000)]],
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
      if (e instanceof HttpErrorResponse) {
        if (e.error.data){
          this.toast.show(e.error.data,{ classname: 'bg-danger text-light', delay: 10000 })
        }
        this.toast.show('Ha ocurrido un error',{ classname: 'bg-danger text-light', delay: 10000 })
      } else {
        this.toast.show('Ha ocurrido un error',{ classname: 'bg-danger text-light', delay: 10000 })
      }
      console.log(e)
    }
  }

  async submit() {
    try {
      const res = await this.amountCurrency.buyTokens( this.form.value)
      this.form.reset()
      console.log(res)
      this.toast.show('Operación exitosa',{ classname: 'bg-success text-light', delay: 10000 })
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        if (e.error.data){
          this.toast.show(e.error.data,{ classname: 'bg-danger text-light', delay: 10000 })
        }
        this.toast.show('Ha ocurrido un error',{ classname: 'bg-danger text-light', delay: 10000 })
      } else {
        this.toast.show('Ha ocurrido un error',{ classname: 'bg-danger text-light', delay: 10000 })
      }
      console.log(e)
    }
  }
}
