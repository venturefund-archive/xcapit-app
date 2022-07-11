import { BigNumber } from "ethers";
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { Blockchain } from "../blockchain/blockchain";
import { rawEthereumData } from "../fixtures/raw-blockchains-data";
import { GasStationOf } from "../gas-station-of/gas-station-of";

export class FeeOf {

  constructor(private _aGasUnits: BigNumber, private _aGasStation: GasStationOf) { }
}


fdescribe('Fee Of', () => {

  it('new', () => {
    expect(new FeeOf(BigNumber.from(1000), new GasStationOf(new Blockchain(rawEthereumData), new FakeHttpClient))).toBeTruthy();
  });
});
