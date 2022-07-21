import { ProviderDataRepo } from '../../provider-data-repo/provider-data-repo';
import { rawProvidersData } from '../../../fixtures/raw-providers-data';
import { rawProviderCountriesData } from '../../../fixtures/raw-provider-countries-data';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { rawPaymentMethodsResponse } from '../../../fixtures/raw-payment-methods-response';
import { DefaultProviders } from './default-providers';
import { rawProviderCoinsData } from '../../../fixtures/raw-provider-coins.data';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

describe('DefaultProviders', () => {
  let providers: DefaultProviders;
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;

  beforeEach(() => {
    remoteConfigSpy = jasmine.createSpyObj('RemoteConfigService', {
      getObject: rawProvidersData,
    });
    providers = new DefaultProviders(new ProviderDataRepo(remoteConfigSpy), new FakeHttpClient(rawPaymentMethodsResponse));
  });

  it('new', () => {
    expect(providers).toBeTruthy();
  });

  it('all', () => {
    expect(providers.all()).toEqual(rawProvidersData);
  });

  it('availablesBy when country have directaCode', async () => {
    const country = rawProviderCountriesData.find((country) => country.name === 'Ecuador');
    const coin = rawProviderCoinsData.find((coin) => coin.value === 'USDC');
    const expectedProviders = rawProvidersData.filter((provider) => provider.alias === 'GB');
    expect(await providers.availablesBy(country, coin)).toEqual(expectedProviders);
  });

  it('availablesBy when country doesnt have directaCode', async () => {
    const country = rawProviderCountriesData.find((country) => country.name === 'Honduras');
    const coin = rawProviderCoinsData.find((coin) => coin.value === 'ETH')
    const expectedProviders = rawProvidersData.filter((provider) => provider.countries.includes('Honduras'));
    expect(await providers.availablesBy(country, coin)).toEqual(expectedProviders);
  });

  it('byAlias', () => {
    const expectedProvider = rawProvidersData.find((provider) => provider.alias === 'kripton');
    expect(providers.byAlias('kripton')).toEqual(expectedProvider);
  });
});
