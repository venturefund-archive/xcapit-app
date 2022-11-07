import { InvestedBalanceOf } from '../invested-balance-of.interface';

export class FakeInvestedBalanceOf implements InvestedBalanceOf {
  constructor(private readonly valueReturn = Promise.resolve(5)) {}

  public value(): Promise<number> {
    return this.valueReturn;
  }
}
