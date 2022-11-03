import { InvestedBalanceOfInjectable } from './invested-balance-of.injectable';

describe('InvestedBalanceOfInjectable', () => {
  const anAddress = '';
  const aPid = 1;
  let investedBalanceOfInjectable: InvestedBalanceOfInjectable;

  beforeEach(() => {
    investedBalanceOfInjectable = new InvestedBalanceOfInjectable(null, null);
  });

  it('new', () => {
    expect(investedBalanceOfInjectable).toBeTruthy();
  });

  it('create', () => {
    expect(investedBalanceOfInjectable.create(anAddress, aPid)).toBeTruthy();
  });
});
