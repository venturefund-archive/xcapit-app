import { DynamicKriptonPriceFactory } from './dynamic-kripton-price-factory';
import { FakeProviderPrice } from '../../provider-price/provider-price';

describe('DynamicKriptonPriceFactory', () => {

  it('new', () => {
    expect(new DynamicKriptonPriceFactory().new(10000, new FakeProviderPrice(1))).toBeTruthy();
  });
});
