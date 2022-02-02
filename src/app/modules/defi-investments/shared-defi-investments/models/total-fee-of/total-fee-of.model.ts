import { BigNumber } from '@ethersproject/bignumber';
import { Fee } from '../../interfaces/fee.interface';

export class TotalFeeOf implements Fee {
  constructor(private readonly _gasFees: Fee[]) {}

  async value(): Promise<BigNumber> {
    let total = BigNumber.from('0');
    for (const gasFee of this._gasFees) {
      total = total.add(await gasFee.value());
    }
    return total;
  }
}
