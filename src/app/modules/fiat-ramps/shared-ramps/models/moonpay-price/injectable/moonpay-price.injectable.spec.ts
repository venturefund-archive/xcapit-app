import { MoonpayPriceInjectable } from './moonpay-price.injectable';

describe('MoonpayPriceInjectable', () => {
  let moonpayPriceInjectable: MoonpayPriceInjectable;

  beforeEach(() => {
    moonpayPriceInjectable = new MoonpayPriceInjectable(null);
  });

  it('new', () => {
    expect(moonpayPriceInjectable).toBeTruthy();
  });

  it('create', () => {
    expect(moonpayPriceInjectable.create(null, null, null)).toBeTruthy();
  });

  it('create with default', () => {
    expect(moonpayPriceInjectable.create(null, null)).toBeTruthy();
  })
});
