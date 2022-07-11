import { BigNumber } from "ethers";
import { GasStationOf } from "../gas-station-of/gas-station-of";

export class FeeOf {

  constructor(private _aGasUnits: BigNumber, private _aGasStation: GasStationOf) { }
}


fdescribe('Fee Of', () => {

  it('new', () => {
    expect(new FeeOf(BigNumber.from(1000))).toBeTruthy();
  });
});
