import { EnvService } from '../../../../../../shared/services/env/env.service';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { DefaultInvestedBalanceOf } from './default-invested-balance-of';
import { CacheService } from '../../../../../../shared/services/cache/cache.service';
import { FakeInvestedBalanceResponse } from '../../invested-balance-response/fake/fake-invested-balance-response';
import { rawInvestedBalanceResponse } from '../../invested-balance-response/raw-invested-balance-response';
import { NullInvestedBalanceResponse } from '../../invested-balance-response/null/null-invested-balance-response';
import { TwoPiProduct } from '../../two-pi-product/two-pi-product.model';
import { rawMATICData } from '../../../../../swaps/shared-swaps/models/fixtures/raw-tokens-data';

describe('DefaultInvestedBalanceOf', () => {
  let investedBalanceOf: DefaultInvestedBalanceOf;
  let envServiceSpy: jasmine.SpyObj<EnvService>;
  let cacheServiceSpy: jasmine.SpyObj<CacheService>;
  const anAddress = '';
  let twoPiProductSpy: jasmine.SpyObj<TwoPiProduct>;

  beforeEach(() => {
    twoPiProductSpy = jasmine.createSpyObj('TwoPiProduct', { id: 1, token: rawMATICData });
    envServiceSpy = jasmine.createSpyObj('EnvService', { byKey: 'http://testTwoPiTheGraphUrl' });
    cacheServiceSpy = jasmine.createSpyObj('CacheService', {
      update: Promise.resolve(),
      get: Promise.resolve(rawInvestedBalanceResponse),
    });
    investedBalanceOf = new DefaultInvestedBalanceOf(
      anAddress,
      twoPiProductSpy,
      new FakeHttpClient(null, { data: { flows: [rawInvestedBalanceResponse] } }),
      envServiceSpy,
      cacheServiceSpy
    );
  });

  it('new', () => {
    expect(investedBalanceOf).toBeTruthy();
  });

  it('value', async () => {
    const fakeInvestedBalanceResponse = new FakeInvestedBalanceResponse();
    expect((await investedBalanceOf.value()).json()).toEqual(fakeInvestedBalanceResponse.json());
    expect(cacheServiceSpy.update).toHaveBeenCalledOnceWith('invested_balance_1', rawInvestedBalanceResponse);
  });

  it('cached', async () => {
    expect((await investedBalanceOf.cached()).balanceUSD()).toEqual(2.010222515191891);
    expect(cacheServiceSpy.get).toHaveBeenCalledOnceWith('invested_balance_1');
  });

  it('cached with no stored value', async () => {
    cacheServiceSpy.get.and.returnValue(Promise.resolve());
    expect(await investedBalanceOf.cached()).toEqual(new NullInvestedBalanceResponse());
    expect(cacheServiceSpy.get).toHaveBeenCalledOnceWith('invested_balance_1');
  });

  it('value when no flows', async () => {
    investedBalanceOf = new DefaultInvestedBalanceOf(
      anAddress,
      twoPiProductSpy,
      new FakeHttpClient(null, { data: { flows: [] } }),
      envServiceSpy,
      cacheServiceSpy
    );
    expect((await investedBalanceOf.value()).json()).toEqual(new NullInvestedBalanceResponse().json());
  });
});
