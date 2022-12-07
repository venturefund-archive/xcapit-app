import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { EnvService } from '../../../../../../shared/services/env/env.service';
import { CacheService } from '../../../../../../shared/services/cache/cache.service';
import { DefaultTotalInvestedBalanceOf } from './default-total-invested-balance-of';
import { rawInvestedBalanceResponse } from '../../invested-balance-response/raw-invested-balance-response';
import { TwoPiProduct } from '../../two-pi-product/two-pi-product.model';
import { RawToken } from '../../../../../swaps/shared-swaps/models/token-repo/token-repo';
import {
  rawMATICData,
  rawUSDCData,
  rawUSDTData,
} from '../../../../../swaps/shared-swaps/models/fixtures/raw-tokens-data';

describe('DefaultTotalInvestedBalanceOf', () => {
  let totalInvestedBalanceOf: DefaultTotalInvestedBalanceOf;
  let envSpy: jasmine.SpyObj<EnvService>;
  let cacheServiceSpy: jasmine.SpyObj<CacheService>;
  const aTestAddress = '';
  const twoPiProductFor = (id: number, token: RawToken) => {
    return jasmine.createSpyObj('TwoPiProduct', { id, token });
  };

  beforeEach(() => {
    envSpy = jasmine.createSpyObj('EnvService', { byKey: 'http://testTwoPiTheGraphUrl' });
    cacheServiceSpy = jasmine.createSpyObj('CacheService', { update: Promise.resolve(), get: Promise.resolve() });
    totalInvestedBalanceOf = new DefaultTotalInvestedBalanceOf(
      aTestAddress,
      [twoPiProductFor(1, rawMATICData), twoPiProductFor(2, rawUSDCData), twoPiProductFor(3, rawUSDTData)],
      cacheServiceSpy,
      new FakeHttpClient(null, { data: { flows: [rawInvestedBalanceResponse] } }),
      envSpy
    );
  });

  it('new', () => {
    expect(totalInvestedBalanceOf).toBeTruthy();
  });

  it('value', async () => {
    expect(await totalInvestedBalanceOf.value()).toEqual(6.030667545575673);
    expect(cacheServiceSpy.update.calls.allArgs()).toEqual([
      ['invested_balance_1', rawInvestedBalanceResponse],
      ['invested_balance_2', rawInvestedBalanceResponse],
      ['invested_balance_3', rawInvestedBalanceResponse],
      ['total_invested_balance', { balance: 6.030667545575673 }],
    ]);
  });

  it('cached with no stored value', async () => {
    expect(await totalInvestedBalanceOf.cached()).toEqual(undefined);
    expect(cacheServiceSpy.get).toHaveBeenCalledOnceWith('total_invested_balance');
  });

  it('cached with stored value', async () => {
    cacheServiceSpy.get.and.returnValue(Promise.resolve({ balance: 18 }));
    expect(await totalInvestedBalanceOf.cached()).toEqual(18);
    expect(cacheServiceSpy.get).toHaveBeenCalledOnceWith('total_invested_balance');
  });
});
