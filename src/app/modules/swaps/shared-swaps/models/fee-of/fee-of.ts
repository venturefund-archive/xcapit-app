import { BigNumber } from 'ethers';
import { Fee } from 'src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface';
import { GasUnits } from '../gas-units/gas-units';


export class FeeOf implements Fee {

  constructor(private _aGasUnits: GasUnits, private _aGasPriceValue: BigNumber) {}

  async value(): Promise<BigNumber> {
    return this._aGasPriceValue.mul(this._aGasUnits);
  }
}
