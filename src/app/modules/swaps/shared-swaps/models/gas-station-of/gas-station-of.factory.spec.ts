import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { providers } from "ethers";
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { Blockchain } from "../blockchain/blockchain";
import { fakeProviders } from "../fakes/fake-ethers-providers";
import { rawPolygonData } from "../fixtures/raw-blockchains-data";
import { rawPolygonGasStation } from "../fixtures/raw-polygon-gs-data";
import { GasStationOf } from "./gas-station-of";


@Injectable({ providedIn: 'root' })
export class GasStationOfFactory {

  create(
    _aBlockchain: Blockchain,
    _httpClient: HttpClient | FakeHttpClient,
    _providers: any = providers
  ) {
    new GasStationOf
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
