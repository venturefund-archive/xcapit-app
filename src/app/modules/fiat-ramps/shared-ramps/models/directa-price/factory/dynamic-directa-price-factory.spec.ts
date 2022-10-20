import { FakeProviderPrice } from '../../provider-price/provider-price';
import { DynamicDirectaPrice } from '../dynamic-directa-price';
import { DynamicDirectaPriceFactory } from './dynamic-directa-price-factory';

describe('DynamicDirectaPriceFactory', () => {

  it('create', () => {
    expect(new DynamicDirectaPriceFactory().new(2000, new FakeProviderPrice(1))).toBeInstanceOf(DynamicDirectaPrice);
  });
});
