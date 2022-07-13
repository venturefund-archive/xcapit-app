import { FakeHttpClient } from 'src/testing/fakes/fake-http.spec';
import { Blockchain } from '../blockchain/blockchain';
import { rawPolygonData } from '../fixtures/raw-blockchains-data';
import { rawPolygonGasStation } from '../fixtures/raw-polygon-gs-data';
import { BigNumberOf } from './big-number-of';
import { PolygonGasPrice } from './polygon-gas-price';


// TODO
// fdescribe('Polygon Gas Price', () => {

//   let gasPrice: PolygonGasPrice;

//   beforeEach(() => {
//     gasPrice = new PolygonGasPrice(new Blockchain(rawPolygonData), new FakeHttpClient(rawPolygonGasStation));
//   });

//   it('new', () => {
//     expect(gasPrice).toBeTruthy();
//   });

//   it('safeLow', async () => {
//     const expectedResult = new BigNumberOf(rawPolygonGasStation.safeLow.maxFee).value();

//     expect(await gasPrice.safeLow()).toEqual(expectedResult);
//   });

//   it('standard', async () => {
//     const expectedResult = new BigNumberOf(rawPolygonGasStation.standard.maxFee).value();

//     expect(await gasPrice.standard()).toEqual(expectedResult);
//   });

//   it('fast', async () => {
//     const expectedResult = new BigNumberOf(rawPolygonGasStation.fast.maxFee).value();

//     expect(await gasPrice.fast()).toEqual(expectedResult);
//   });
// });
