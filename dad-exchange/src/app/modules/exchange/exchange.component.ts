import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AmountCurrencyService} from "../../services/amount-currency.service";
import jwt_decode from "jwt-decode";
import {NodeService} from "../../services/node.service";
import {BalanceService} from "../../services/balance.service";

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit{
  success = false;
  form: FormGroup
  balance: any = {}

  currencyList: Array<string> =  []
  currency: any
  constructor(
    private fb: FormBuilder,
    private amountCurrency: AmountCurrencyService, public nodeService: NodeService, private balanceService : BalanceService) {

    const userToken: string = window.localStorage.getItem('token') as string
    const jwt: any = jwt_decode(userToken)
    console.log(jwt)

    this.form = this.fb.group( {
      amount: [0, [Validators.required, Validators.min(0.001)]],
      fromCurrency: [null, [Validators.required]],
      toCurrency: [null, [Validators.required]],
      receive: [0],
      token_wallet: jwt?.token_public_key,
      coin_wallet: jwt?.wallet_public_key
    })


    this.form.get('fromCurrency')?.valueChanges.subscribe( v => {
      this.form.get('receive')?.setValue(this.calcAmountToReceive())
    })

    this.form.get('amount')?.valueChanges.subscribe((v) => {
      this.form.get('receive')?.setValue(this.calcAmountToReceive())
    })
    this.form.get('toCurrency')?.valueChanges.subscribe((v) => {
      this.form.get('receive')?.setValue(this.calcAmountToReceive())
    })
  }

  calcAmountToReceive() {
    return this.amountCurrency.getConversion(
      this.form.get('amount')?.value,
      this.currency[this.form.get('fromCurrency')?.value],
      this.currency[this.form.get('toCurrency')?.value]
      )
  }

  async ngOnInit(){
    try {
      let coinBalance: any = await this.balanceService.coinBalance(
        {
          node: this.nodeService.target,
          coin_wallet: this.form.get('coin_wallet')?.value
        })
      coinBalance = JSON.parse(coinBalance)

      const tokenBalance : any= await this.balanceService.tokenBalance(this.form.get('token_wallet')?.value)

      this.balance =  {
        coin: coinBalance?.balance,
        token: tokenBalance.tokens
      }

      const exchangeRate: any = await this.amountCurrency.exchangeRate();

      this.currency = exchangeRate
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
  async submit() {
    try {
      const res = await this.amountCurrency.exchange( {
        amount : this.form.get('amount')?.value,
        from_currency : this.form.get('fromCurrency')?.value,
        to_currency : this.form.get('toCurrency')?.value,
        token_wallet : this.form.get('token_wallet')?.value,
        coin_wallet : this.form.get('coin_wallet')?.value,
        node: this.nodeService.target
      })
      this.success = true;
    } catch (e) {
      console.log(e)
    }
  }
}
