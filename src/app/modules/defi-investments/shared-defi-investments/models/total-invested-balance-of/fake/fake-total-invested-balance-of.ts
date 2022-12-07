import { TotalInvestedBalanceOf } from '../total-invested-balance-of.interface';

export class FakeTotalInvestedBalanceOf implements TotalInvestedBalanceOf {
  constructor(private readonly valueReturn = Promise.resolve(5)) {}

  public value(): Promise<number> {
    return this.valueReturn;
  }

  public cached(): Promise<number> {
    return Promise.resolve(0);
  }
}
