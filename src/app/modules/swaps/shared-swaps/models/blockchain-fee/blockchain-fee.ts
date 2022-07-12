import { Fee } from "src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface";
import { FormattedFee } from "src/app/modules/defi-investments/shared-defi-investments/models/formatted-fee/formatted-fee.model";
import { NativeTokenOf } from "../native-token-of/native-token-of";


export type RawAmount = {
  value: number;
  token: string;
}


export class BlockchainFee {

  constructor(private _aFee: Fee, private _aNativeTokenOf: NativeTokenOf) { }

  async json(): Promise<RawAmount> {
    return {
      value: (await new FormattedFee(this._aFee).value()).toNumber(),
      token: (await this._aNativeTokenOf.value()).symbol()
    };
  }
}
