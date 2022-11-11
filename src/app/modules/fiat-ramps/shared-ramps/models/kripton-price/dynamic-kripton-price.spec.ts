import { interval } from 'rxjs';
import { DynamicKriptonPrice } from './dynamic-kripton-price';
import { take } from 'rxjs/operators';
import { FakeProviderPrice, ProviderPrice } from '../provider-price/provider-price';


describe('DynamicKriptonPrice', () => {
  const testValue = 7;
  let fakeKriptonPrice: ProviderPrice;
  let dynamicKriptonPrice: ProviderPrice;


  beforeEach(() => {
    fakeKriptonPrice = new FakeProviderPrice(7);
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
});
