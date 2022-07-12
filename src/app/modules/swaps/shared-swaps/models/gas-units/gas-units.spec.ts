import { BigNumber } from "ethers";

export class GasUnits {

  constructor(private _aRawGasUnits: string|number) { }

  value(): BigNumber {
    return BigNumber.from(this._aRawGasUnits);
  }
}


fdescribe('GasUnits', () => {

  const aRawGasUnits = 100;
  let gasUnits: GasUnits;

  beforeEach(() => {
    gasUnits = new GasUnits(aRawGasUnits);
  });

  it('new', () => {
    expect(gasUnits).toBeTruthy();
  });

  it('value', () => {
    expect(gasUnits.value().eq(aRawGasUnits)).toBeTrue();
  });

});
