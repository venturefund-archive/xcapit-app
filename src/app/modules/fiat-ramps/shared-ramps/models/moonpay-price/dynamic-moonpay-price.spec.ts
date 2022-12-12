import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { FakeProviderPrice, ProviderPrice } from '../provider-price/provider-price';
import { DynamicMoonpayPrice } from './dynamic-moonpay-price';

describe('DynamicMoonpayPrice', () => {
  const testValue = 7;
  let moonpayPrice: ProviderPrice;
  let dynamicMoonpayPrice: ProviderPrice;
  beforeEach(() => {
    moonpayPrice = new FakeProviderPrice(testValue);
    dynamicMoonpayPrice = DynamicMoonpayPrice.create(15, moonpayPrice);
  });

  it('new', () => {
    expect(new DynamicMoonpayPrice(interval(1), moonpayPrice)).toBeTruthy();
  });

  it('create', () => {
    expect(dynamicMoonpayPrice).toBeInstanceOf(DynamicMoonpayPrice);
  });

  it('value', async () => {
    const exchange_rate = await dynamicMoonpayPrice.value().pipe(take(1)).toPromise();

    expect(exchange_rate).toEqual(testValue);
  });
});
