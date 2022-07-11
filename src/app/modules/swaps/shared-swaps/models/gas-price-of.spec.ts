import { Blockchain } from './blockchain/blockchain';
import { rawPolygonData } from './fixtures/raw-blockchains-data';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { HttpClient } from '@angular/common/http';
import { fakeGasPrice, fakeProviders } from './fakes/fake-ethers-providers';
import { providers } from 'ethers';
import { DefaultGasPriceOf, GasPrice } from './gas-price/gas-price';


export class GasStationOf {

  constructor(
    private _aBlockchain: Blockchain,
    private _httpClient: HttpClient | FakeHttpClient,
    private _providers: any = providers
  ) { }

  price(): GasPrice {
    return new DefaultGasPriceOf(this._aBlockchain, this._providers);
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
    const expectedValue = fakeGasPrice;

    const gasPriceValue = await gasStation.price().safeLow();

    expect(gasPriceValue.toNumber()).toBeTruthy(expectedValue.toNumber());
  })
});
