import { Providers } from '../providers/providers.interface';
import { FakeProviders } from '../providers/fake/fake-providers';
import { rawProvidersData } from '../../fixtures/raw-providers-data';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ProviderTokensOf } from './provider-tokens-of';

describe('ProviderTokensOf', () => {
  let providers: Providers;
  let coinsSpy: jasmine.SpyObj<Coin>[];

  beforeEach(() => {
    providers = new FakeProviders(rawProvidersData, rawProvidersData[0], Promise.resolve([]));

    coinsSpy = [
      jasmine.createSpyObj('Coin', {
        value: 'USDC',
        network: 'MATIC',
      }),
      jasmine.createSpyObj('Coin', {
        value: 'ETH',
        network: 'ERC20',
      }),
      jasmine.createSpyObj('Coin', {
        value: 'RIF',
        network: 'RSK',
      }),
    ];
  });

  it('new', () => {
    expect(new ProviderTokensOf(providers, coinsSpy)).toBeTruthy();
  });

  it('all', () => {
    const expectedCoins = coinsSpy.filter((coin) => coin.value !== 'RIF');
    expect(new ProviderTokensOf(providers, coinsSpy).all()).toEqual(expectedCoins);
  });

  it('byAlias', () => {
    const expectedCoins = coinsSpy.filter((coin) => coin.value == 'USDC');
    expect(new ProviderTokensOf(providers, coinsSpy).byAlias('PX')).toEqual(expectedCoins);
  });
});
