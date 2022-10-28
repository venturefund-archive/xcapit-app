import { DefaultMoonpayPrice } from "../default-moonpay-price";
import { DefaultMoonpayPriceFactory } from "./default-moonpay-price-factory";

describe('DefaultMoonpayPriceFactory', () => {
    it('new', () => {
      expect(new DefaultMoonpayPriceFactory().new('','',null)).toBeInstanceOf(DefaultMoonpayPrice);
    });
  });