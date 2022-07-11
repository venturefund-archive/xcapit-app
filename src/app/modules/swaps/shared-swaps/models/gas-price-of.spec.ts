import { Blockchain } from './blockchain/blockchain';
import { rawPolygonData } from './fixtures/raw-blockchains-data';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { HttpClient } from '@angular/common/http';
import { fakeGasPrice, fakeProviders } from './fakes/fake-ethers-providers';
import { providers } from 'ethers';


export class GasStationOf {

  constructor(
    private _aBlockchain: Blockchain,
    private _httpClient: HttpClient | FakeHttpClient,
    private _providers: any = providers
  ) {
    console.log("hi")
  }

  price() {
    return true;
  }
}


fdescribe('Gas Station Of', () => {

  let gasStation: GasStationOf;

  beforeEach(() => {
    gasStation = new GasStationOf(
      new Blockchain(rawPolygonData),
      new FakeHttpClient(),
      fakeProviders
    );
  });

  it('new', () => {
    expect(gasStation).toBeTruthy();
  });

  it('default gas price', async () => {
    const gasPriceValue = await gasStation.price().safeLow();
    const expectedValue = fakeGasPrice;

    expect(gasPriceValue.toNumber()).toBeTruthy(expectedValue.toNumber());
  })
});
