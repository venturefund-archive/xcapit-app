import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { AmountOf } from '../amount-of/amount-of';
import { DefaultBlockchain } from '../blockchain/blockchain';
import { rawPolygonData } from '../fixtures/raw-blockchains-data';
import { rawPolygonGasStation } from '../fixtures/raw-polygon-gs-data';
import { BigNumberOf } from './big-number-of';
import { PolygonGasPrice } from './polygon-gas-price';


describe('Polygon Gas Price', () => {

  let gasPrice: PolygonGasPrice;
  const polygonBlockchain = new DefaultBlockchain(rawPolygonData);
  const _expectedResult = (aBigNumber: BigNumberOf) => {
    return new AmountOf(
      aBigNumber.value().toString(),
      polygonBlockchain.nativeToken()
    );
  }

  beforeEach(() => {
    gasPrice = new PolygonGasPrice(polygonBlockchain, new FakeHttpClient(rawPolygonGasStation));
  });

  it('new', () => {
    expect(gasPrice).toBeTruthy();
  });

  it('safeLow', async () => {
    const expectedResult = _expectedResult(new BigNumberOf(rawPolygonGasStation.safeLow.maxFee));

    expect((await gasPrice.safeLow()).value()).toEqual(expectedResult.value());
  });

  it('standard', async () => {
    const expectedResult = _expectedResult(new BigNumberOf(rawPolygonGasStation.standard.maxFee));

    expect((await gasPrice.standard()).value()).toEqual(expectedResult.value());
  });

  it('fast', async () => {
    const expectedResult = _expectedResult(new BigNumberOf(rawPolygonGasStation.fast.maxFee));

    expect((await gasPrice.fast()).value()).toEqual(expectedResult.value());
  });
});
