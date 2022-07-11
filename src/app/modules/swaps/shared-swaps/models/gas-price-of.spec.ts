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

  const _gasStationOf = (_aBlockchain: Blockchain): GasStationOf => {
    return new GasStationOf(
      _aBlockchain,
      new FakeHttpClient(),
      fakeProviders
    );
  }

  it('new', () => {
    const gasStation = _gasStationOf(Blockchain(rawPolygonData))

    expect(gasStation).toBeTruthy();
  });

  // it('default gas price', async () => {
  //   const expectedValue = fakeGasPrice;

  //   const gasPriceValue = await gasStation.price().safeLow();

  //   expect(gasPriceValue.toNumber()).toBeTruthy(expectedValue.toNumber());
  // })
});
