import { FakeDirectaPrice } from '../default-directa-price';
import { DynamicDirectaPrice } from '../dynamic-directa-price';
import { DynamicDirectaPriceFactory } from './dynamic-directa-price-factory';

describe('DynamicDirectaPriceFactory', () => {

  it('create', () => {
    expect(new DynamicDirectaPriceFactory().new(2000, new FakeDirectaPrice(1))).toBeInstanceOf(DynamicDirectaPrice);
  });
});
