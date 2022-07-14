import { Injectable } from "@angular/core";
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec";
import { Blockchain } from "../blockchain/blockchain";


@Injectable({ providedIn: 'root' })
export class GasStationOfFactory {

  create() {
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
