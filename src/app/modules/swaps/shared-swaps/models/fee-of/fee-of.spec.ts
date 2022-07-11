import { BigNumber } from "ethers";
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { Blockchain } from "../blockchain/blockchain";
import { fakeProviders } from "../fakes/fake-ethers-providers";
import { rawEthereumData } from "../fixtures/raw-blockchains-data";
import { GasStationOf } from "../gas-station-of/gas-station-of";

export class FeeOf {

  constructor(private _aGasUnits: BigNumber, private _aGasStation: GasStationOf) { }
}


fdescribe('Fee Of', () => {

  let fee: FeeOf;

  beforeEach(() => {
    fee = new FeeOf(
      BigNumber.from(1000),
      new GasStationOf(
        new Blockchain(rawEthereumData),
        new FakeHttpClient(),
        fakeProviders
      )
    );
  });

  it('new', () => {
    expect().toBeTruthy();
  });
});
