import { DefaultDirectaPrice } from "../default-directa-price";
import { DefaultDirectaPriceFactory } from "./default-directa-price-factory";

describe('DefaultDirectaPriceFactory', () => {
  it('new', () => {
    expect(new DefaultDirectaPriceFactory().new('',null,null)).toBeInstanceOf(DefaultDirectaPrice);
  });
});
