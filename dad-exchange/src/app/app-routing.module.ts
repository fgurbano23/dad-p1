import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {TokensComponent} from "./tokens/tokens.component";
import {TransactionsComponent} from "./transactions/transactions.component";
import {ExchangeComponent} from "./exchange/exchange.component";
import {SummaryComponent} from "./summary/summary.component";
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sign-in',
        component: LoginComponent,
      },
      {
        path: 'sign-up',
        component: RegisterComponent,
      },
      {
        path: 'tokens',
        component: TokensComponent,
      },
      {
        path: 'transfer',
        component: TransactionsComponent,
      },
      {
        path: 'exchange',
        component: ExchangeComponent,
      },
      {
        path: 'balance',
        component: SummaryComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'balance'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
