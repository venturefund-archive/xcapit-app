import { rawProvidersData } from '../../fixtures/raw-providers-data';
import { ProviderDataRepo } from './provider-data-repo';
import { rawProviderCountriesData } from '../../fixtures/raw-provider-countries-data';
import { RemoteConfigService } from '../../../../../shared/services/remote-config/remote-config.service';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';

describe('ProviderDataRepo', () => {
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;
  let coinSpy: jasmine.SpyObj<Coin>; 
  beforeEach(() => {
    remoteConfigSpy = jasmine.createSpyObj('RemoteConfigService', {
      getObject: rawProvidersData,
    });
    coinSpy = jasmine.createSpyObj(
      {},
      {
        value: "ETH",
        network: "ERC20",
      }
    );
    
  });

  it('new', () => {
    expect(new ProviderDataRepo(remoteConfigSpy , 'buy')).toBeTruthy();
  });

  it('all', () => {
    expect(new ProviderDataRepo(remoteConfigSpy , 'buy').all()).toEqual(rawProvidersData);
  });

  it('byCountry', () => {
    const country = rawProviderCountriesData.find((country) => country.name === 'Honduras');
    const expectedProviders = rawProvidersData.filter((provider) => provider.alias === 'moonpay');
    expect(new ProviderDataRepo(remoteConfigSpy , 'buy' ).byCountry(country)).toEqual(expectedProviders);
  });

  it('byCountryAndCoin', () => {
    const country = rawProviderCountriesData.find((country) => country.name === 'Honduras');
    const expectedProviders = rawProvidersData.filter((provider) => provider.alias === 'moonpay');
    expect(new ProviderDataRepo(remoteConfigSpy , 'buy').byCountryAndCoin(country, coinSpy)).toEqual(expectedProviders);
  });
});
