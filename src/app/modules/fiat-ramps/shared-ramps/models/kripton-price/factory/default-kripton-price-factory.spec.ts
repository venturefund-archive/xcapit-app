import { DefaultKriptonPrice } from '../default-kripton-price';
import { DefaultKriptonPriceFactory } from './default-kripton-price-factory';

describe('DefaultKriptonPriceFactory', () => {
  it('new', () => {
    expect(new DefaultKriptonPriceFactory().new('', null, 'cash-in', null)).toBeInstanceOf(DefaultKriptonPrice);
  });
});
