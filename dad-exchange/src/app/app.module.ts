import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TokensComponent } from './modules/tokens/tokens.component';
import { TransactionsComponent } from './modules/transactions/transactions.component';
import { ExchangeComponent } from './modules/exchange/exchange.component';
import { SummaryComponent } from './modules/summary/summary.component';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ErrorInterceptor} from "./interceptors/error.interceptor";
import {HeaderInterceptor} from "./interceptors/header.interceptor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HeaderComponent } from './layout/header/header.component';
import { CurrencyPipe } from './pipes/currency.pipe';
import { FooterComponent } from './layout/footer/footer.component';

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
    CurrencyPipe,
    FooterComponent
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
