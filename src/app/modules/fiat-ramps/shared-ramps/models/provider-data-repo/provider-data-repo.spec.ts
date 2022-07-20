import { rawProvidersData } from '../../fixtures/raw-providers-data';
import { ProviderDataRepo } from './provider-data-repo';
import { rawProviderCountriesData } from '../../fixtures/raw-provider-countries-data';
import { rawProviderCoinsData } from '../../fixtures/raw-provider-coins.data';

describe('ProviderDataRepo', () => {
  it('new', () => {
    expect(new ProviderDataRepo()).toBeTruthy();
  });

  it('all', () => {
    expect(new ProviderDataRepo(rawProvidersData).all()).toEqual(rawProvidersData);
  });

  it('byCountry', () => {
    const country = rawProviderCountriesData.find((country) => country.name === 'Honduras');
    const expectedProviders = rawProvidersData.filter((provider) => provider.alias === 'moonpay');
    expect(new ProviderDataRepo(rawProvidersData).byCountry(country)).toEqual(expectedProviders);
  });

  it('byCountryAndCoin', () => {
    const country = rawProviderCountriesData.find((country) => country.name === 'Honduras');
    const coin = rawProviderCoinsData.find((coin) => coin.value === 'ETH');
    const expectedProviders = rawProvidersData.filter((provider) => provider.alias === 'moonpay');
    expect(new ProviderDataRepo(rawProvidersData).byCountryAndCoin(country, coin)).toEqual(expectedProviders);
  });
});
