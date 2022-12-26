import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TokensComponent } from './tokens/tokens.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ExchangeComponent } from './exchange/exchange.component';
import { SummaryComponent } from './summary/summary.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ErrorInterceptor} from "./error.interceptor";
import {HeaderInterceptor} from "./header.interceptor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HeaderComponent } from './header/header.component';
import { CurrencyPipe } from './currency.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TokensComponent,
    TransactionsComponent,
    ExchangeComponent,
    SummaryComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    CurrencyPipe
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        NgbModule,
        ReactiveFormsModule,
        FormsModule
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
