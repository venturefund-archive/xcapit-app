import { AmountOf } from "src/app/modules/swaps/shared-swaps/models/amount-of/amount-of";
import { Blockchain } from "src/app/modules/swaps/shared-swaps/models/blockchain/blockchain";
import { RawToken } from "src/app/modules/swaps/shared-swaps/models/token-repo/token-repo";
import { RawTransfer } from "../../../types/raw-transfer.type";

export class NativeTransfer {
  constructor(private readonly _aRawTransfer: RawTransfer, private readonly _aToken: RawToken) {}

  public fee(): number {
    return new AmountOf(this._aRawTransfer.gas_price.toString(), new Blockchain())
      .times(this._aRawTransfer.gas_spent)
      .value();
  }

  public token(): RawToken {
    return this._aToken;
  }

  public raw(): RawTransfer{
    return this._aRawTransfer;
  }
}