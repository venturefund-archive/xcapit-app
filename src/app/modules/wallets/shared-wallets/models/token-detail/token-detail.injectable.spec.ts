import { TestBed } from '@angular/core/testing';
import { TokenDetailInjectable } from './token-detail-injectable.service';
import { CovalentBalances } from '../balances/covalent-balances/covalent-balances';
import { TokenPrices } from '../prices/token-prices/token-prices';
import { BalanceCacheService } from '../../services/balance-cache/balance-cache.service';
import { TokenDetail } from './token-detail';

describe('TokenDetailInjectable', () => {
  let covalentBalancesStub: jasmine.SpyObj<CovalentBalances>;
  let tokenPricesStub: jasmine.SpyObj<TokenPrices>;
  let balanceCacheServiceStub: jasmine.SpyObj<BalanceCacheService>;
  let service: TokenDetailInjectable;

  beforeEach(() => {
    service = TestBed.inject(TokenDetailInjectable);
  });

  it('should create', () => {
    expect(service.create(covalentBalancesStub, tokenPricesStub, null, balanceCacheServiceStub)).toBeInstanceOf(
      TokenDetail
    );
  });
});
