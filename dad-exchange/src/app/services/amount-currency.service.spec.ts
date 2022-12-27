import { TestBed } from '@angular/core/testing';

import { AmountCurrencyService } from './amount-currency.service';

describe('AmountCurrencyService', () => {
  let service: AmountCurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmountCurrencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
