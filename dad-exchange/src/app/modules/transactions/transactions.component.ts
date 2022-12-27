import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AmountCurrencyService} from "../../services/amount-currency.service";
import jwt_decode from "jwt-decode";
import {NodeService} from "../../services/node.service";
import {BalanceService} from "../../services/balance.service";
import {ToastService} from "../../services/toast.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {
  jwt: any
  form: FormGroup
  balance: any
  success = false
  beneficiaryList:any = []


  constructor(
    private fb: FormBuilder,
    private amountCurrency: AmountCurrencyService,
    public nodeService: NodeService,
    public balanceService: BalanceService,
    private toast: ToastService) {

    const userToken: string = window.localStorage.getItem('token') as string
    const jwt: any = jwt_decode(userToken)
    console.log(jwt)
    this.form = this.fb.group( {
      amount: [null, [Validators.required, Validators.min(0.001)]],
      receiver: [null,  [Validators.required]],
      coin_wallet: jwt?.wallet_public_key
    })
  }
  hideAlert() {
    this.success = false
  }

  async ngOnInit() {
    try {
      const userToken: string = window.localStorage.getItem('token') as string
      this.jwt = jwt_decode(userToken)

      console.log(this.jwt)
      const exchangeRate: any = await this.amountCurrency.exchangeRate();

      let coinBalance: any = await this.balanceService.coinBalance({
        node: this.nodeService.target,
        coin_wallet: this.jwt?.wallet_public_key
      })
      coinBalance = JSON.parse(coinBalance);
      this.balance = coinBalance.balance

      let users: any = await this.amountCurrency.getBeneficiaries();
      this.beneficiaryList = users.data.filter((users: any) => users.id != this.jwt.sub);

      console.log(this.beneficiaryList)
    } catch (e) {
      console.log()
    }
  }
  async submit() {
    try {
      const res = await this.amountCurrency.transfer( {
        node: this.nodeService.target,
        coin_wallet: this.form.get('coin_wallet')?.value,
        receiver: this.form.get('receiver')?.value,
        amount: this.form.get('amount')?.value
      })
      console.log(res)
      this.success = true
      this.toast.show('Operación exitosa',{ classname: 'bg-success text-light', delay: 10000 })
      this.form.reset()
    } catch (e) {
      if (e instanceof HttpErrorResponse) {

        if (e.error.data){
          this.toast.show(e.error.data,{ classname: 'bg-danger text-light', delay: 10000 })
        } else {
          this.toast.show('Ha ocurrido un error',{ classname: 'bg-danger text-light', delay: 10000 })
        }

      } else {
        this.toast.show('Ha ocurrido un error',{ classname: 'bg-danger text-light', delay: 10000 })
      }
      console.log(e)
    }
  }
}
