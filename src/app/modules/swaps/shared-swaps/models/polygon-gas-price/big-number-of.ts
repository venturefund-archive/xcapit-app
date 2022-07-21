import { BigNumber, utils } from 'ethers';


export class BigNumberOf {

  constructor(private _aGweiAmount: number) { }

  value(): BigNumber {
    return utils.parseUnits(this._aGweiAmount.toFixed(9), 'gwei')
  }
}
