import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyName'
})
export class CurrencyPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case 'coin':
        return 'AURAX';
      case 'token':
        return 'Token';
      case 'dollar':
        return 'Dólar'
      default:;
        return '-'
    }
  }

}
