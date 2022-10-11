import { DynamicKriptonPriceFactory } from './dynamic-kripton-price-factory';
import { FakeKriptonPrice } from '../default-kripton-price';

describe('DynamicKriptonPriceFactory', () => {

  it('new', () => {
    expect(new DynamicKriptonPriceFactory().new(10000, new FakeKriptonPrice(1))).toBeTruthy();
  });
});
