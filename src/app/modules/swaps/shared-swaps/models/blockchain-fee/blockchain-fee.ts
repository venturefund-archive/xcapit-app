import { Fee } from "src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface";

export class BlockchainFee {

  constructor(private _aFee: Fee, private _aNativeTokenOf: NativeTokenOf) { }

  async json(): Promise<RawAmount> {
    return {
      value: (await this._aFee.value()).toNumber(),
      token: (await this._aNativeTokenOf.value()).symbol()
    };
  }
}
