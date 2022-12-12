import { TotalInvestedBalanceOfInjectable } from './total-invested-balance-of.injectable';
import { TwoPiProduct } from '../../two-pi-product/two-pi-product.model';

describe('TotalInvestedBalanceOfInjectable', () => {
  const anAddress = '';
  let twoPiProductSpy: jasmine.SpyObj<TwoPiProduct>;
  let totalInvestedBalanceOfInjectable: TotalInvestedBalanceOfInjectable;

  beforeEach(() => {
    totalInvestedBalanceOfInjectable = new TotalInvestedBalanceOfInjectable(null, null, null);
  });

  it('new', () => {
    expect(totalInvestedBalanceOfInjectable).toBeTruthy();
  });

  it('create', () => {
    expect(
      totalInvestedBalanceOfInjectable.create(anAddress, [twoPiProductSpy, twoPiProductSpy, twoPiProductSpy])
    ).toBeTruthy();
  });
});
