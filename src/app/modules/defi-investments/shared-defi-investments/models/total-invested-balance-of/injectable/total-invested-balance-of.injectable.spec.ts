import { TotalInvestedBalanceOfInjectable } from './total-invested-balance-of.injectable';

fdescribe('TotalInvestedBalanceOfInjectable', () => {
  const anAddress = '';
  const pids = [1, 2, 3];
  let totalInvestedBalanceOfInjectable: TotalInvestedBalanceOfInjectable;

  beforeEach(() => {
    totalInvestedBalanceOfInjectable = new TotalInvestedBalanceOfInjectable(null, null, null);
  });

  it('new', () => {
    expect(totalInvestedBalanceOfInjectable).toBeTruthy();
  });

  it('create', () => {
    expect(totalInvestedBalanceOfInjectable.create(anAddress, pids)).toBeTruthy();
  });
});
