import { TestBed } from '@angular/core/testing';
import { TotalBalanceController } from './total-balance.controller';
import { FakePrices } from '../../prices/fake-prices/fake-prices';
import { FakeBalances } from '../../balances/fake-balances/fake-balances';
import { FakeBalance } from '../fake-balance/fake-balance';
import { TotalBalance } from './total-balance';

describe('TotalBalanceController', () => {
  let service: TotalBalanceController;

  beforeEach(() => {
    service = TestBed.inject(TotalBalanceController);
  });

  it('should create', () => {
    expect(service.new(new FakePrices(), new FakeBalances(), new FakeBalance())).toBeInstanceOf(TotalBalance);
  });
});
