import { BigNumber, utils } from 'ethers';

export class BigNumberOf {
  constructor(private _aGweiAmount: string | number) {}

  value(): BigNumber {
    return utils.parseUnits(this._normalizedGweiAmount().toFixed(9), 'gwei');
  }

  private _normalizedGweiAmount(): number {
    return parseFloat(`${this._aGweiAmount}`);
  }
}
