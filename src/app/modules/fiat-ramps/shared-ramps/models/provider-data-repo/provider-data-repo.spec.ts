import { rawProvidersData } from '../../fixtures/raw-providers-data';
import { ProviderDataRepo } from './provider-data-repo';
import { rawProviderCountriesData } from '../../fixtures/raw-provider-countries-data';
import { RemoteConfigService } from '../../../../../shared/services/remote-config/remote-config.service';
import { rawProviderCoinsData } from '../../fixtures/raw-provider-coins.data';

describe('ProviderDataRepo', () => {
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;

  beforeEach(() => {
    remoteConfigSpy = jasmine.createSpyObj('RemoteConfigService', {
      getObject: rawProvidersData,
    });
  });

  it('new', () => {
    expect(new ProviderDataRepo(remoteConfigSpy)).toBeTruthy();
  });

  it('all', () => {
    expect(new ProviderDataRepo(remoteConfigSpy).all()).toEqual(rawProvidersData);
  });

  it('byCountry', () => {
    const country = rawProviderCountriesData.find((country) => country.name === 'Honduras');
    const expectedProviders = rawProvidersData.filter((provider) => provider.alias === 'moonpay');
    expect(new ProviderDataRepo(remoteConfigSpy).byCountry(country)).toEqual(expectedProviders);
  });

  it('byCountryAndCoin', () => {
    const country = rawProviderCountriesData.find((country) => country.name === 'Honduras');
    const coin = rawProviderCoinsData.find((coin) => coin.value === 'ETH');
    const expectedProviders = rawProvidersData.filter((provider) => provider.alias === 'moonpay');
    expect(new ProviderDataRepo(remoteConfigSpy).byCountryAndCoin(country, coin)).toEqual(expectedProviders);
  });
});
