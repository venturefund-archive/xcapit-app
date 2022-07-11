import { BigNumber } from "ethers";

export class FeeOf {

  constructor(private _aGasUnits: BigNumber) { }
}


fdescribe('Fee Of', () => {

  it('new', () => {
    expect(new FeeOf(BigNumber.from(1000))).toBeTruthy();
  });
});
