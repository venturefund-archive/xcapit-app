import { BigNumber } from "ethers";


export class GasUnits {

  constructor(private _aRawGasUnits: string|number) { }

  value(): BigNumber {
    return BigNumber.from(this._aRawGasUnits);
  }
}
