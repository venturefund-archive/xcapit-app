import { Blockchain, DefaultBlockchain } from '../blockchain/blockchain';
import { rawEthereumData, rawPolygonData, rawSolanaData } from '../fixtures/raw-blockchains-data';
import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { fakeRawGasPrice, fakeProviders } from '../fakes/fake-ethers-providers';
import { BigNumberOf } from '../polygon-gas-price/big-number-of';
import { rawPolygonGasStation } from '../fixtures/raw-polygon-gs-data';
import { GasStationOf } from './gas-station-of';
import { AmountOf } from '../amount-of/amount-of';


describe('Gas Station Of', () => {
  let gasStation: GasStationOf;
  const solanaBlockchain = new DefaultBlockchain(rawSolanaData);
  const polygonBlockchain = new DefaultBlockchain(rawPolygonData);
  const ethereumBlockchain = new DefaultBlockchain(rawEthereumData);

  const _gasStationOf = (_aBlockchain: Blockchain): GasStationOf => {
    return new GasStationOf(_aBlockchain, new FakeHttpClient(rawPolygonGasStation), fakeProviders);
  };

  beforeEach(() => {
    gasStation = _gasStationOf(polygonBlockchain);
  });

  it('new', () => {
    expect(gasStation).toBeTruthy();
  });

  it('default gas price', async () => {
    const gasStation = _gasStationOf(ethereumBlockchain);
    const expectedEthereumAmount = new AmountOf(fakeRawGasPrice.toString(), ethereumBlockchain.nativeToken());

    const gasPrice = await gasStation.price().safeLow();

    expect(gasPrice.value()).toEqual(expectedEthereumAmount.value());
  });

  it('polygon gas price', async () => {
    const gasPrice = await gasStation.price().safeLow();
    const expectedPolygonAmount = new AmountOf(
      new BigNumberOf(rawPolygonGasStation.safeLow.maxFee).value().toString(),
      ethereumBlockchain.nativeToken()
    );

    expect(gasPrice.value()).toEqual(expectedPolygonAmount.value());
  });

  it('solana gas price', async () => {
    const gasStation = _gasStationOf(solanaBlockchain);
    const expectedSolanaAmount = new AmountOf('1', solanaBlockchain.nativeToken());

    const gasPrice = await gasStation.price().safeLow();

    expect(gasPrice.value()).toEqual(expectedSolanaAmount.value());
  });
});
