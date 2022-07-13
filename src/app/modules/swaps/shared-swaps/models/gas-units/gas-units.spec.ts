import { GasUnits } from "./gas-units";


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
