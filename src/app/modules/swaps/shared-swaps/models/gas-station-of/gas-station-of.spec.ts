import { Blockchain } from '../blockchain/blockchain';
import { rawEthereumData, rawPolygonData } from '../fixtures/raw-blockchains-data';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { fakeRawGasPrice, fakeProviders } from '../fakes/fake-ethers-providers';
import { BigNumberOf } from '../polygon-gas-price/big-number-of';
import { rawPolygonGasStation } from '../fixtures/raw-polygon-gs-data';
import { GasStationOf } from './gas-station-of';
import { AmountOf } from '../amount-of/amount-of';


describe('Gas Station Of', () => {

  let gasStation: GasStationOf;
  const polygonBlockchain = new Blockchain(rawPolygonData);
  const ethereumBlockchain = new Blockchain(rawEthereumData);
  const expectedEthereumAmount = new AmountOf(fakeRawGasPrice.toString(), ethereumBlockchain.nativeToken());
  const expectedPolygonAmount = new AmountOf(
    new BigNumberOf(rawPolygonGasStation.safeLow.maxFee).value().toString(),
    ethereumBlockchain.nativeToken());

  const _gasStationOf = (_aBlockchain: Blockchain): GasStationOf => {
    return new GasStationOf(
      _aBlockchain,
      new FakeHttpClient(rawPolygonGasStation),
      fakeProviders
    );
  };

  beforeEach(() => {
    gasStation = _gasStationOf(polygonBlockchain);
  })

  it('new', () => {
    expect(gasStation).toBeTruthy();
  });

  it('default gas price', async () => {
    const gasStation = _gasStationOf(ethereumBlockchain);

    const gasPriceValue = await gasStation.price().safeLow();

    expect(gasPriceValue.value()).toEqual(expectedEthereumAmount.value());
  });

  it('polygon gas price', async () => {
    const gasPriceValue = await gasStation.price().safeLow();

    expect(gasPriceValue.value()).toEqual(expectedPolygonAmount.value());
  });
});
