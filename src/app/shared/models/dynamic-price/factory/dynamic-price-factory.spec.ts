import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ApiWalletService } from '../../../../modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { DynamicPriceFactory } from './dynamic-price-factory';

describe('DynamicPriceFactory', () => {
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let coinSpy: jasmine.SpyObj<Coin>;
  beforeEach(() => {
    const coinSpy = jasmine.createSpyObj(
      'Coin',
      {},
      {
        value: 'MATIC',
        network: 'MATIC',
      }
    );
  });

  it('create', () => {
    expect(new DynamicPriceFactory()).toBeTruthy();
  });

  it('new', () => {
    expect(new DynamicPriceFactory().new(10000, coinSpy, apiWalletServiceSpy)).toBeTruthy();
  });
});
