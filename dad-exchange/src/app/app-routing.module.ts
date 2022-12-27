import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {TokensComponent} from "./tokens/tokens.component";
import {TransactionsComponent} from "./transactions/transactions.component";
import {ExchangeComponent} from "./exchange/exchange.component";
import {SummaryComponent} from "./summary/summary.component";
import {AuthGuard} from "./guards/auth.guard";
import {RedirectGuard} from "./guards/redirect.guard";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/sign-in'
      },
      {
        path: 'sign-in',
        component: LoginComponent,
        canActivate: [RedirectGuard]
      },
      {
        path: 'sign-up',
        component: RegisterComponent,
        canActivate: [RedirectGuard]
      },
      {
        path: 'tokens',
        component: TokensComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'transfer',
        component: TransactionsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'exchange',
        component: ExchangeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'balance',
        component: SummaryComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'balance',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
