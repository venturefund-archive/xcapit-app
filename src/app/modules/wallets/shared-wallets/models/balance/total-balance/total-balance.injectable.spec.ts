import { TestBed } from '@angular/core/testing';
import { TotalBalanceInjectable } from './total-balance-injectable.service';
import { FakePrices } from '../../prices/fake-prices/fake-prices';
import { FakeBalances } from '../../balances/fake-balances/fake-balances';
import { FakeBalance } from '../fake-balance/fake-balance';
import { TotalBalance } from './total-balance';

describe('TotalBalanceInjectable', () => {
  let service: TotalBalanceInjectable;

  beforeEach(() => {
    service = TestBed.inject(TotalBalanceInjectable);
  });

  it('should create', () => {
    expect(service.create(new FakePrices(), new FakeBalances(), new FakeBalance())).toBeInstanceOf(TotalBalance);
  });
});
