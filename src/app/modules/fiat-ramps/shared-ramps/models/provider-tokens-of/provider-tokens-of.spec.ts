import { Providers } from '../providers/providers.interface';
import { FakeProviders } from '../providers/fake/fake-providers';
import { rawProvidersData } from '../../fixtures/raw-providers-data';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ProviderTokensOf } from './provider-tokens-of';
import { of } from 'rxjs';
import { FiatRampsService } from '../../services/fiat-ramps.service';

describe('ProviderTokensOf', () => {
  let providers: Providers;
  let providerTokensOf : ProviderTokensOf;
  let coinsSpy: jasmine.SpyObj<Coin>[];
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  const availableKriptonCurrencies = [
    {
      network: 'ERC20',
      currencies: ['ETH'],
    },
    {
      network: 'MATIC',
      currencies: ['USDC', 'DAI'],
    },
  ];
  beforeEach(() => {
    providers = new FakeProviders(
      rawProvidersData,
      rawProvidersData.find((provider) => provider.alias === 'PX'),
      Promise.resolve([]),
      of()
    );

    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      getKriptonAvailableCurrencies: of(availableKriptonCurrencies),
    });

    coinsSpy = [
      jasmine.createSpyObj(
        'Coin',
        {},
        {
          value: 'USDC',
          network: 'MATIC',
        }
      ),
      jasmine.createSpyObj(
        'Coin',
        {},
        {
          value: 'ETH',
          network: 'ERC20',
        }
      ),
      jasmine.createSpyObj(
        'Coin',
        {},
        {
          value: 'DAI',
          network: 'MATIC',
        }
      ),
      jasmine.createSpyObj(
        'Coin',
        {},
        {
          value: 'RIF',
          network: 'RSK',
        }
      ),
    ];
    providerTokensOf = new ProviderTokensOf(providers, coinsSpy, fiatRampsServiceSpy)
  });

  it('new', async () => {
    expect(providerTokensOf).toBeTruthy();
  });

  it('all', async () => {
    const expectedCoins = coinsSpy.filter((coin) => coin.value !== 'RIF');
    expect(await providerTokensOf.all()).toEqual(expectedCoins);
  });

  it('byAlias', async () => {
    const expectedCoins = coinsSpy.filter((coin) => coin.value == 'USDC');
    expect(await providerTokensOf.byAlias('PX')).toEqual(expectedCoins);
  });
});
