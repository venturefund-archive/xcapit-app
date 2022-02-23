import { DynamicPrice } from './dynamic-price.model';
import { Coin } from '../../../modules/wallets/shared-wallets/interfaces/coin.interface';
import { interval, of, Subscription } from 'rxjs';
import { ApiWalletService } from '../../../modules/wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { take } from 'rxjs/operators';

describe('DynamicPrice', () => {
  let coinSpy: jasmine.SpyObj<Coin>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;

  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'ETH' });
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', { getPrices: of({ prices: { ETH: 20 } }) });
  });

  it('should create', () => {
    expect(new DynamicPrice(interval(15), coinSpy, apiWalletServiceSpy)).toBeTruthy();
  });

  it('should create interval', () => {
    expect(DynamicPrice.create(15, coinSpy, apiWalletServiceSpy)).toBeTruthy();
  });

  it('should subscribe to interval', () => {
    const dynamicPrice = DynamicPrice.create(15, coinSpy, apiWalletServiceSpy);
    let count = 0;
    const subscription = dynamicPrice
      .value()
      .pipe(take(2))
      .subscribe({
        next: (res) => {
          count++;
          expect(res).toEqual(20);
        },
        complete: () => {
          expect(count).toEqual(2);
        },
      });
    expect(subscription).toBeInstanceOf(Subscription);
  });
});
