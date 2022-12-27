import {Component, OnInit} from '@angular/core';
import jwt_decode from "jwt-decode";
import {NodeService} from "../../services/node.service";
import {BalanceService} from "../../services/balance.service";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit{

  jwt: any
  balance: any =  {
    coin: 0,
    token: 0
  }
  constructor(public nodeService: NodeService, public balanceService: BalanceService) {
  }

  async ngOnInit() {
    const userToken: string = window.localStorage.getItem('token') as string
    this.jwt = jwt_decode(userToken)

    try {
      let coinBalance: any = await this.balanceService.coinBalance({
        node: this.nodeService.target,
        coin_wallet: this.jwt?.wallet_public_key
      })
      coinBalance = JSON.parse(coinBalance);

      const tokenBalance:any = await this.balanceService.tokenBalance(this.jwt?.token_public_key)

      this.balance = { coin: coinBalance.balance, token: tokenBalance.tokens}


    } catch (e) {
      console.log(e)
    }

  }


}
