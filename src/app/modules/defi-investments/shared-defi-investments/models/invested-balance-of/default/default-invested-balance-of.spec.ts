import { EnvService } from '../../../../../../shared/services/env/env.service';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { DefaultInvestedBalanceOf } from './default-invested-balance-of';

describe('DefaultInvestedBalanceOf', () => {
  let investedBalanceOf: DefaultInvestedBalanceOf;
  let envServiceSpy: jasmine.SpyObj<EnvService>;
  const anAddress = '';
  const aPid = 1;

  beforeEach(() => {
    envServiceSpy = jasmine.createSpyObj('EnvService', { byKey: 'http://testTwoPiTheGraphUrl' });
    investedBalanceOf = new DefaultInvestedBalanceOf(
      anAddress,
      aPid,
      new FakeHttpClient(null, { data: { flows: [{ balanceUSD: '5' }] } }),
      envServiceSpy
    );
  });

  it('new', () => {
    expect(investedBalanceOf).toBeTruthy();
  });

  it('value', async () => {
    expect(await investedBalanceOf.value()).toEqual(5);
  });

  it('value when no flows', async () => {
    investedBalanceOf = new DefaultInvestedBalanceOf(
      anAddress,
      aPid,
      new FakeHttpClient(null, { data: { flows: [] } }),
      envServiceSpy
    );
    expect(await investedBalanceOf.value()).toEqual(0);
  });
});
