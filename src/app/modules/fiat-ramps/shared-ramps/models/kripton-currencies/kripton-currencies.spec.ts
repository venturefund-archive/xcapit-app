import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { KriptonCurrencies } from './kripton-currencies';

describe('KriptonCurrencies', () => {
  let coinSpy: jasmine.SpyObj<Coin>;

  const kriptonCoins = [
    { symbol: 'ETH', network: 'ERC20' },
    { symbol: 'USDT', network: 'ERC20' },
    { symbol: 'USDC', network: 'MATIC' },
  ];

  beforeEach(() => {
    coinSpy = jasmine.createSpyObj(
      'Coin',
      {},
      {
        value: 'ETH',
        network: 'ERC20',
      }
    );
  });

  it('should create with all available coins and kripton specific coins to filter', () => {
    expect(new KriptonCurrencies([coinSpy], kriptonCoins)).toBeTruthy();
  });

  it('should create with all available coins only and default kripton specific coins', () => {
    expect(KriptonCurrencies.create([coinSpy])).toBeTruthy();
  });

  it('should return coins included in kriptonCoins', () => {
    expect(new KriptonCurrencies([coinSpy], kriptonCoins).value()).toEqual([coinSpy]);
  });
});
