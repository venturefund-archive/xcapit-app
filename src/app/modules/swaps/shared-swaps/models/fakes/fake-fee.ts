import { BigNumber } from "ethers";
import { Fee } from "src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface";


export class FakeFee implements Fee {

  constructor(private _aTestData: string|number) { }

  async value(): Promise<BigNumber> {
    return BigNumber.from(this._aTestData);
  }
}
