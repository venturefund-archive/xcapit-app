import { BigNumber } from "ethers";

export class FakeFee implements Fee {

  constructor(private _aTestData: string|number) { }

  async value(): Promise<BigNumber> {
    return BigNumber.from(this._aTestData);
  }
}
