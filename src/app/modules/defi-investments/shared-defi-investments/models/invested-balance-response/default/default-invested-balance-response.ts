import { InvestedBalanceResponse } from '../invested-balance-response.interface';
import { RawInvestedBalanceResponse } from '../raw-invested-balance-response';
import { Token } from '../../../../../swaps/shared-swaps/models/token/token';
import { AmountOf } from 'src/app/modules/wallets/shared-wallets/models/blockchain-tx/amount-of/amount-of';

export class DefaultInvestedBalanceResponse implements InvestedBalanceResponse {
  constructor(
    private readonly _aRawInvestedBalanceResponse: RawInvestedBalanceResponse,
    private readonly _aToken: Token
  ) {}

  public balance(): number {
    return new AmountOf(this._aRawInvestedBalanceResponse.balance, this._aToken).value();
  }

  public balanceUSD(): number {
    return parseFloat(this._aRawInvestedBalanceResponse.balanceUSD);
  }

  public json(): RawInvestedBalanceResponse {
    return Object.assign({}, this._aRawInvestedBalanceResponse);
  }
}
