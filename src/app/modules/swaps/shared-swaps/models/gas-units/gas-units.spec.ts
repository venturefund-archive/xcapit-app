import { BigNumber } from "ethers";

export class GasUnits {

  constructor(private _aRawGasUnits: string|number) { }

  value() {
    return BigNumber;
  }
}


fdescribe('GasUnits', () => {

  it('new', () => {
    expect(new GasUnits(100)).toBeTruthy();
  });

  it('value', () => {
    expect(new GasUnits(100).value()).toBeTruthy();
  });

});
