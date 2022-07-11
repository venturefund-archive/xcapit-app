import { BigNumber } from 'ethers';
import { Fee } from 'src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface';


export class FeeOf implements Fee {

  constructor(private _aGasUnits: BigNumber, private _aGasPriceValue: BigNumber) {}

  async value(): Promise<BigNumber> {
    return this._aGasPriceValue.mul(this._aGasUnits);
  }
}
