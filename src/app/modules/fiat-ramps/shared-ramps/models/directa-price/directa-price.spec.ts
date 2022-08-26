import { DirectaPrice } from './directa-price';
import { interval, of, Subscription } from 'rxjs';
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
    directaPrice = DirectaPrice.create(1000, 'ars', coinSpy, fiatRampsServiceSpy);
  });

  it('new', () => {
    expect(new DirectaPrice(interval(1), 'ars', coinSpy, fiatRampsServiceSpy)).toBeTruthy();
  });

  it('create', () => {
    expect(directaPrice).toBeInstanceOf(DirectaPrice);
  });

  it('value', async () => {
    const subscription = directaPrice.value().pipe(take(2))
    expect(result).toEqual(3);
});
  // it('should subscribe to interval', () => {
  //   const kriptonDynamicPrice = KriptonDynamicPrice.create(
  //     15,
  //     'ars',
  //     coinSpy,
  //     new FakeHttpClient({}, amountOutResponse)
  //   );
  //   let count = 0;
  //   const subscription = kriptonDynamicPrice
  //     .value()
  //     .pipe(take(2))
  //     .subscribe({
  //       next: (res) => {
  //         count++;
  //         expect(res).toEqual(0.5);
  //       },
  //       complete: () => {
  //         expect(count).toEqual(2);
  //       },
  //     });
  //   expect(subscription).toBeInstanceOf(Subscription);
  // });
});
