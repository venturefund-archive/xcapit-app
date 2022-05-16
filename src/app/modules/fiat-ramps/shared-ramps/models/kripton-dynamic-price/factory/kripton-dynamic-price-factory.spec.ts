import { KriptonDynamicPriceFactory } from './kripton-dynamic-price-factory';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';

describe('KriptonDynamicPriceFactory', () => {
  let coinSpy = jasmine.createSpyObj(
    'Coin',
    {},
    {
      value: 'MATIC',
      network: 'MATIC',
    }
  );
  it('create', () => {
    expect(new KriptonDynamicPriceFactory()).toBeTruthy();
  });

  it('new', () => {
    expect(new KriptonDynamicPriceFactory().new(10000, 'ars', coinSpy, new FakeHttpClient())).toBeTruthy();
  });
});
