import { ProviderDataRepo } from '../provider-data-repo/provider-data-repo';
import { rawProvidersData } from '../../fixtures/raw-providers-data';
import { rawProviderCountriesData } from '../../fixtures/raw-provider-countries-data';
import { FakeHttpClient } from '../../../../../../testing/fakes/fake-http.spec';
import { rawPaymentMethodsResponse } from '../../fixtures/raw-payment-methods-response';
import { Providers } from './providers';

describe('Providers', () => {
  let providers: Providers;

  beforeEach(() => {
    providers = new Providers(
      new ProviderDataRepo(rawProvidersData),
      new FakeHttpClient(rawPaymentMethodsResponse)
    );
  });

  it('new', () => {
    expect(providers).toBeTruthy();
  });

  it('availablesBy when country have directaCode', async () => {
    const country = rawProviderCountriesData.find((country) => country.name === 'Ecuador');
    const expectedProviders = rawProvidersData.filter((provider) => provider.alias === 'GB');
    expect(await providers.availablesBy(country)).toEqual(expectedProviders);
  });

  it('availablesBy when country doesnt have directaCode', async () => {
    const country = rawProviderCountriesData.find((country) => country.name === 'Honduras');
    const expectedProviders = rawProvidersData.filter((provider) => provider.countries.includes('Honduras'));
    expect(await providers.availablesBy(country)).toEqual(expectedProviders);
  });

  it('all', () => {
    expect(providers.all()).toEqual(rawProvidersData);
  });
});
