import { InvestedBalanceOfInjectable } from './invested-balance-of.injectable';
import { TwoPiProduct } from '../../two-pi-product/two-pi-product.model';

describe('InvestedBalanceOfInjectable', () => {
  let investedBalanceOfInjectable: InvestedBalanceOfInjectable;

  beforeEach(() => {
    investedBalanceOfInjectable = new InvestedBalanceOfInjectable(null, null, null);
  });

  it('new', () => {
    expect(investedBalanceOfInjectable).toBeTruthy();
  });

  it('create', () => {
    expect(investedBalanceOfInjectable.create('', {} as TwoPiProduct)).toBeTruthy();
  });
});
