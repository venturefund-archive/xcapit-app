import { InvestedBalanceOf } from '../invested-balance-of.interface';
import { InvestedBalanceResponse } from '../../invested-balance-response/invested-balance-response.interface';
import { FakeInvestedBalanceResponse } from '../../invested-balance-response/fake/fake-invested-balance-response';

export class FakeInvestedBalanceOf implements InvestedBalanceOf {
  constructor(
    private readonly valueReturn: Promise<InvestedBalanceResponse> = Promise.resolve(new FakeInvestedBalanceResponse())
  ) {}

  public value(): Promise<InvestedBalanceResponse> {
    return this.valueReturn;
  }

  cached(): Promise<InvestedBalanceResponse> {
    return Promise.resolve(new FakeInvestedBalanceResponse(2));
  }
}
