import { TestBed } from '@angular/core/testing';
import { TokenDetailController } from './token-detail.controller';
import { CovalentBalances } from '../balances/covalent-balances/covalent-balances';
import { TokenPrices } from '../prices/token-prices/token-prices';
import { Coin } from '../../interfaces/coin.interface';
import { BalanceCacheService } from '../../services/balance-cache/balance-cache.service';
import { TokenDetail } from './token-detail';

describe('TokenDetailController', () => {
  let covalentBalancesStub: jasmine.SpyObj<CovalentBalances>;
  let tokenPricesStub: jasmine.SpyObj<TokenPrices>;
  let coinStub: jasmine.SpyObj<Coin>;
  let balanceCacheServiceStub: jasmine.SpyObj<BalanceCacheService>;
  let service: TokenDetailController;

  beforeEach(() => {
    service = TestBed.inject(TokenDetailController);
  });

  it('should create', () => {
    expect(service.new(covalentBalancesStub, tokenPricesStub, coinStub, balanceCacheServiceStub)).toBeInstanceOf(
      TokenDetail
    );
  });
});
