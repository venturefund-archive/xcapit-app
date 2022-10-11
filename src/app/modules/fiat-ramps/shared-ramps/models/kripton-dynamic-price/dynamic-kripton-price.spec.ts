import { interval } from 'rxjs';
import { DynamicKriptonPrice } from './dynamic-kripton-price';
import { FakeKriptonPrice, KriptonPrice } from './default-kripton-price';
import { take } from 'rxjs/operators';


describe('DynamicKriptonPrice', () => {
  const testValue = 7;
  let fakeKriptonPrice: KriptonPrice;
  let dynamicKriptonPrice: KriptonPrice;


  beforeEach(() => {
    fakeKriptonPrice = new FakeKriptonPrice(7);
    dynamicKriptonPrice = DynamicKriptonPrice.create(15, fakeKriptonPrice);
  });

  it('should create', () => {
    expect(new DynamicKriptonPrice(interval(15), fakeKriptonPrice)).toBeTruthy();
  });

 it('should create interval', () => {
    expect(DynamicKriptonPrice.create(15, fakeKriptonPrice)).toBeTruthy();
  });

  it('value', async () => {
    const kripton_price = await dynamicKriptonPrice.value().pipe(take(1)).toPromise();

    expect(kripton_price).toEqual(testValue);
  });


 //  it('should subscribe to interval', () => {
 //    const kriptonDynamicPrice = KriptonDynamicPrice.create(
 //      15,
 //      'ars',
 //      coinSpy,
 //      new FakeHttpClient({}, amountOutResponse)
 //    );
 //    let count = 0;
 //    const subscription = kriptonDynamicPrice
 //      .value()
 //      .pipe(take(2))
 //      .subscribe({
 //        next: (res) => {
 //          count++;
 //          expect(res).toEqual(0.5);
 //        },
 //        complete: () => {
 //          expect(count).toEqual(2);
 //        },
 //      });
 //    expect(subscription).toBeInstanceOf(Subscription);
 //  });
});
