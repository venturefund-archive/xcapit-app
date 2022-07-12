import { BigNumber } from "ethers";

export class GasUnits {

  constructor(private _aRawGasUnits: string|number) { }

  value(): BigNumber {
    return BigNumber.from(this._aRawGasUnits);
  }
}


fdescribe('GasUnits', () => {

  let gasUnits: GasUnits;

  beforeEach(() => {
    gasUnits = new GasUnits(100);
  });

  it('new', () => {
    expect(gasUnits).toBeTruthy();
  });

  it('value', () => {
    expect(new GasUnits(100).value().eq(100)).toBeTrue();
  });

});
