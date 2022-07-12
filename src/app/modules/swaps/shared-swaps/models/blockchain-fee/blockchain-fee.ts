import { Fee } from "src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface";
import { NativeTokenOf } from "../native-token-of/native-token-of";
import { RawAmount } from "./blockchain-fee.spec";


export class BlockchainFee {

  constructor(private _aFee: Fee, private _aNativeTokenOf: NativeTokenOf) { }

  async json(): Promise<RawAmount> {
    return {
      value: (await this._aFee.value()).toNumber(),
      token: (await this._aNativeTokenOf.value()).symbol()
    };
  }
}
