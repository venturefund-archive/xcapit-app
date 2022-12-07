import { FakeProviderPrice } from '../../provider-price/provider-price';
import { DynamicMoonpayPrice } from '../dynamic-moonpay-price';
import { DynamicMoonpayPriceFactory } from './dynamic-moonpay-price-factory';

describe('DynamicMoonpayPriceFactory', () => {

  it('create', () => {
    expect(new DynamicMoonpayPriceFactory().new(2000, new FakeProviderPrice(1))).toBeInstanceOf(DynamicMoonpayPrice);
  });
});
