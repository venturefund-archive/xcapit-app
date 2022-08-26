import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { KriptonDynamicPrice } from './kripton-dynamic-price';
import { FakeHttpClient } from '../../../../../../testing/fakes/fake-http.spec';

fdescribe('KriptonDynamicPrice', () => {
  let coinSpy: jasmine.SpyObj<Coin>;

  const amountOutResponse = {
    data: {
      amount_out: '2',
      costs: '0.02917868',
    },
  };

  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'MATIC' });
  });

  it('should create', () => {
    expect(new KriptonDynamicPrice(interval(15), 'ars', coinSpy, new FakeHttpClient())).toBeTruthy();
  });

  it('should create interval', () => {
    expect(KriptonDynamicPrice.create(15, 'ars', coinSpy, new FakeHttpClient())).toBeTruthy();
  });

  it('should subscribe to interval', () => {
    const kriptonDynamicPrice = KriptonDynamicPrice.create(
      15,
      'ars',
      coinSpy,
      new FakeHttpClient({}, amountOutResponse)
    );
    let count = 0;
    const subscription = kriptonDynamicPrice
      .value()
      .pipe(take(2))
      .subscribe({
        next: (res) => {
          count++;
          expect(res).toEqual(0.5);
        },
        complete: () => {
          expect(count).toEqual(2);
        },
      });
    console.log(subscription);
    expect(subscription).toBeInstanceOf(Subscription);
  });
});
