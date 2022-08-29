import { RawToken } from '../../../../swaps/shared-swaps/models/token-repo/token-repo';
import { AmountOf } from '../../../../swaps/shared-swaps/models/amount-of/amount-of';
import { DefaultToken } from '../../../../swaps/shared-swaps/models/token/token';
import { RawTransfer } from '../../types/raw-transfer.type';

export class Transfer {
  constructor(private readonly _aRawTransfer: RawTransfer, private readonly _aToken: RawToken) {}

  public fee(): number {
    return new AmountOf(this._aRawTransfer.gas_price.toString(), new DefaultToken(this._aToken))
      .times(this._aRawTransfer.gas_spent)
      .value();
  }

  public token(): RawToken {
    return this._aToken;
  }

  pu
}
