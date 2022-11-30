import { rawInvestedBalanceResponse, RawInvestedBalanceResponse } from '../raw-invested-balance-response';
import { InvestedBalanceResponse } from '../invested-balance-response.interface';

export class FakeInvestedBalanceResponse implements InvestedBalanceResponse {
  constructor(
    private balanceUSDReturn: number = 2.0102225151918912,
    private jsonReturn: RawInvestedBalanceResponse = rawInvestedBalanceResponse
  ) {}

  public balance(): number {
    return 2;
  }

  public balanceUSD(): number {
    return this.balanceUSDReturn;
  }

  public json(): RawInvestedBalanceResponse {
    return this.jsonReturn;
  }
}
