import { Injectable } from "@angular/core";
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { Blockchain } from "../blockchain/blockchain";
import { fakeProviders } from "../fakes/fake-ethers-providers";
import { rawPolygonData } from "../fixtures/raw-blockchains-data";
import { rawPolygonGasStation } from "../fixtures/raw-polygon-gs-data";


@Injectable({ providedIn: 'root' })
export class GasStationOfFactory {

  create(
    aBlockchain: Blockchain,
    httpClient: HttpClient | FakeHttpClient,
    providers: any = providers

  ) {
    return true;
  }
}


fdescribe('GasStationOfFactory', () => {

  it('new', () => {
    expect(new GasStationOfFactory()).toBeTruthy();
  });

  it('create', () => {
    const gasStation = new GasStationOfFactory().create(
      new Blockchain(rawPolygonData),
      new FakeHttpClient(rawPolygonGasStation),
      fakeProviders
    );

    expect(gasStation).toBeTruthy();
  });
});
