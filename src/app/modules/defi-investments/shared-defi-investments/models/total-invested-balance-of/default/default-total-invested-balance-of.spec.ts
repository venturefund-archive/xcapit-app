import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { EnvService } from '../../../../../../shared/services/env/env.service';
import { CacheService } from '../../../../../../shared/services/cache/cache.service';
import { DefaultTotalInvestedBalanceOf } from './default-total-invested-balance-of';

describe('DefaultTotalInvestedBalanceOf', () => {
  let totalInvestedBalanceOf: DefaultTotalInvestedBalanceOf;
  let envSpy: jasmine.SpyObj<EnvService>;
  let cacheServiceSpy: jasmine.SpyObj<CacheService>;
  const aTestAddress = '';
  const aTestPids = [1, 2, 3];

  beforeEach(() => {
    envSpy = jasmine.createSpyObj('EnvService', { byKey: 'http://testTwoPiTheGraphUrl' });
    cacheServiceSpy = jasmine.createSpyObj('CacheService', { update: Promise.resolve(), get: Promise.resolve() });
    totalInvestedBalanceOf = new DefaultTotalInvestedBalanceOf(
      aTestAddress,
      aTestPids,
      cacheServiceSpy,
      new FakeHttpClient(null, { data: { flows: [{ balanceUSD: '5' }] } }),
      envSpy
    );
  });

  it('new', () => {
    expect(totalInvestedBalanceOf).toBeTruthy();
  });

  it('value', async () => {
    expect(await totalInvestedBalanceOf.value()).toEqual(15);
    expect(cacheServiceSpy.update).toHaveBeenCalledOnceWith('total_invested_balance', { balance: 15 });
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
