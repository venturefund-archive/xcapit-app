import { BigNumber } from "ethers";
import { Fee } from "src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface";


export class DummyFee implements Fee {

  constructor(private _dummyData: string|number) { }

  async value(): Promise<BigNumber> {
    return BigNumber.from(this._dummyData);
  }
}
