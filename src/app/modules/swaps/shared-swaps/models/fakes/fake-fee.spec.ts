import { BigNumber } from "@ethersproject/bignumber";
import { Fee } from "src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface";

export class FakeFee implements Fee {
    value(): Promise<BigNumber> {
        throw new Error("Method not implemented.");
    }
}


fdescribe('FakeFee', () => {

  it('new', () => {
    expect(new FakeFee()).toBeTruthy();
  });
});
