export class GasUnits {

  constructor(private _aRawGasUnits: string|number) { }
}


fdescribe('GasUnits', () => {

  it('new', () => {
    expect(new GasUnits(100)).toBeTruthy();
  });


});
