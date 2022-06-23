import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FiatRampCurrenciesOf } from './fiat-ramp-currencies-of';
import { rawProvidersData } from '../../fixtures/raw-providers-data';
import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';

describe('FiatRampCurrenciesOf', () => {
  let coinSpy: jasmine.SpyObj<Coin>;
  let kriptonProvider: FiatRampProvider;

  beforeEach(() => {
    coinSpy = jasmine.createSpyObj(
      'Coin',
      {},
      {
        value: 'MATIC',
        network: 'MATIC',
      }
    );

    kriptonProvider = rawProvidersData.find((provider) => provider.alias === 'kripton');
  });

  it('should create with all available coins and kripton specific coins to filter', () => {
    expect(new FiatRampCurrenciesOf(kriptonProvider, [coinSpy])).toBeTruthy();
  });

  it('should return coins included in kriptonCoins', () => {
    expect(new FiatRampCurrenciesOf(kriptonProvider, [coinSpy]).value()).toEqual([coinSpy]);
  });
});
