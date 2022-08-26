import { DirectaPrice } from './directa-price';
import { interval, of, Subscriber, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { FiatRampsService } from '../../services/fiat-ramps.service';

fdescribe('DirectaPrice', () => {
  let coinSpy: jasmine.SpyObj<Coin>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let directaPrice: DirectaPrice;

  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'MATIC' });
    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampService', {
      getDirectaExchangeRate: of({ fx_rate: 3 }),
    });
    directaPrice = DirectaPrice.create(15, 'ars', coinSpy, fiatRampsServiceSpy);
  });

  it('new', () => {
    expect(new DirectaPrice(interval(1), 'ars', coinSpy, fiatRampsServiceSpy)).toBeTruthy();
  });

  it('create', () => {
    expect(directaPrice).toBeInstanceOf(DirectaPrice);
  });

  fit('value', async () => {
    let count = 0;
    // const subscription: Subscription = directaPrice
    //   .value()
    //   .pipe(take(2))
    //   .subscribe({
    //     next: (res) => {
    //       count++;
    //       expect(res).toEqual(3);
    //     },
    //     complete: () => {
    //       expect(count).toEqual(1);
    //     },
    //   });
    // expect(subscription).toBeTruthy();
    const subscription = directaPrice.value().toPromise();
    expect(subscription).toEqual(3);
  });
});
