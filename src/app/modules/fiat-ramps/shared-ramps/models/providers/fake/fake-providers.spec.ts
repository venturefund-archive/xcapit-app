import { of } from 'rxjs';
import { rawProvidersData } from '../../../fixtures/raw-providers-data';
import { FiatRampProviderCountry } from '../../../interfaces/fiat-ramp-provider-country';
import { FiatRampProvider } from '../../../interfaces/fiat-ramp-provider.interface';
import { FakeProviders } from './fake-providers';


describe('FakeProviders', () => {
  let fakeProviders: FakeProviders;
  let expectedProvider: FiatRampProvider;
  let countrySpy: jasmine.SpyObj<FiatRampProviderCountry>;

  const availableDirectaProviderTest = {
    code: 'TEST-CODE',
    logo: 'test-logo',
    name: 'test-name',
    paymentType: 'BANK_DEPOSIT',
  };

  beforeEach(() => {
    expectedProvider = rawProvidersData.find((provider) => provider.alias === 'kripton');
    fakeProviders = new FakeProviders(
      rawProvidersData,
      expectedProvider,
      Promise.resolve([expectedProvider]),
      of(availableDirectaProviderTest)
    );
  });

  it('new', () => {
    expect(fakeProviders).toBeTruthy();
  });

  it('all', () => {
    expect(fakeProviders.all()).toEqual(rawProvidersData);
  });

  it('byAlias', () => {
    expect(fakeProviders.byAlias('kripton')).toEqual(expectedProvider);
  });

  it('availablesBy', async () => {
    expect(await fakeProviders.availablesBy(countrySpy)).toEqual([expectedProvider]);
  });

  it('availablesDirectaProviders', async () => {
    expect(await fakeProviders.availableDirectaProviders(countrySpy).toPromise()).toEqual(availableDirectaProviderTest);
  });
});
