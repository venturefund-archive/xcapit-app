import { BigNumber, FixedNumber } from 'ethers';
import { Fee } from '../../interfaces/fee.interface';

export class FormattedFee {
  constructor(private readonly _aFee: Fee, private readonly _decimals: number = 18) {}
  async value(): Promise<number> {
    return FixedNumber.from(await this._aFee.value())
      .divUnsafe(FixedNumber.from(BigNumber.from('10').pow(this._decimals)))
      .toUnsafeFloat();
  }
}
