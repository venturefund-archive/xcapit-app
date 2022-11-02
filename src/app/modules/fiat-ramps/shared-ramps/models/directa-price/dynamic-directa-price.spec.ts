import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { FakeProviderPrice, ProviderPrice } from '../provider-price/provider-price';
import { DynamicDirectaPrice } from './dynamic-directa-price';

describe('DynamicDirectaPrice', () => {
  const testValue = 7;
  let directaPrice: ProviderPrice;
  let dynamicDirectaPrice: ProviderPrice;
  beforeEach(() => {
    directaPrice = new FakeProviderPrice(testValue);
    dynamicDirectaPrice = DynamicDirectaPrice.create(15, directaPrice);
  });

  it('new', () => {
    expect(new DynamicDirectaPrice(interval(1), directaPrice)).toBeTruthy();
  });

  it('create', () => {
    expect(dynamicDirectaPrice).toBeInstanceOf(DynamicDirectaPrice);
  });

  it('value', async () => {
    const exchange_rate = await dynamicDirectaPrice.value().pipe(take(1)).toPromise();

    expect(exchange_rate).toEqual(testValue);
  });
});
