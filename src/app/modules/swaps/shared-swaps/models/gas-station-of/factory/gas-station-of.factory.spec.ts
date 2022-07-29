import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { Blockchain } from "../../blockchain/blockchain";
import { fakeProviders } from "../../fakes/fake-ethers-providers";
import { rawPolygonData } from "../../fixtures/raw-blockchains-data";
import { rawPolygonGasStation } from "../../fixtures/raw-polygon-gs-data";
import { GasStationOfFactory } from "./gas-station-of.factory";


describe('GasStationOfFactory', () => {

  it('new', () => {
    expect(new GasStationOfFactory(null)).toBeTruthy();
  });

  it('create', () => {
    const gasStation = new GasStationOfFactory(null).create(
      new Blockchain(rawPolygonData),
      new FakeHttpClient(rawPolygonGasStation),
      fakeProviders
    );

    expect(gasStation).toBeTruthy();
  });
});
