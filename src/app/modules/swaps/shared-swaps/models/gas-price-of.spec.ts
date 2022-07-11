import { Blockchain } from './blockchain/blockchain';
import { rawEthereumData, rawPolygonData } from './fixtures/raw-blockchains-data';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { HttpClient } from '@angular/common/http';
import { fakeGasPrice, fakeProviders } from './fakes/fake-ethers-providers';
import { providers } from 'ethers';
import { DefaultGasPriceOf, GasPrice } from './gas-price/gas-price';
import { BigNumberOf } from './polygon-gas-price/big-number-of';
import { rawPolygonGasStation } from './fixtures/raw-polygon-gs-data';
import { PolygonGasPrice } from './polygon-gas-price/polygon-gas-price';


export class GasStationOf {

  constructor(
    private _aBlockchain: Blockchain,
    private _httpClient: HttpClient | FakeHttpClient,
    private _providers: any = providers
  ) { }

  price(): GasPrice {
    let gasPrice: GasPrice = new DefaultGasPriceOf(this._aBlockchain, this._providers);
    if (!this._aBlockchain.gasPriceClass()) {
      gasPrice = new PolygonGasPrice(this._httpClient);
    }
    return gasPrice;
  }
}


fdescribe('Gas Station Of', () => {

  let gasStation: GasStationOf;
  const _gasStationOf = (_aBlockchain: Blockchain): GasStationOf => {
    return new GasStationOf(
      _aBlockchain,
      new FakeHttpClient(rawPolygonGasStation),
      fakeProviders
    );
  };

  beforeEach(() => {
    gasStation = _gasStationOf(new Blockchain(rawPolygonData));
  })

  it('new', () => {
    expect(gasStation).toBeTruthy();
  });

  it('default gas price', async () => {
    const gasStation = _gasStationOf(new Blockchain(rawEthereumData));
    const expectedValue = fakeGasPrice;

    const gasPriceValue = await gasStation.price().safeLow();

    expect(gasPriceValue.toNumber()).toEqual(expectedValue.toNumber());
  });

  it('polygon gas price', async () => {
    const expectedValue = new BigNumberOf(rawPolygonGasStation.safeLow.maxFee).value();

    const gasPriceValue = await gasStation.price().safeLow();

    expect(gasPriceValue.toNumber()).toEqual(expectedValue.toNumber());
  });
});
