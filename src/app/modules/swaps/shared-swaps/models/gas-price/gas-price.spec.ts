import { Blockchain } from '../blockchain/blockchain';
import { fakeGasPrice, fakeProviders } from '../fakes/fake-ethers-providers';
import { rawEthereumData } from '../fixtures/raw-blockchains-data';
import { DefaultGasPricesOf, GasPrice } from './gas-price';


fdescribe('Default Gas Price', () => {

  let gasPrice: GasPrice;

  beforeEach(() => {
    gasPrice = new DefaultGasPricesOf(new Blockchain(rawEthereumData), fakeProviders);
  });

  it('new', () => {
    expect(gasPrice).toBeTruthy();
  });

  it('safeLow', async () => {
    expect((await gasPrice.safeLow()).toNumber()).toEqual(fakeGasPrice.toNumber());
  });

  it('standard', async () => {
    expect((await gasPrice.standard()).toNumber()).toEqual(fakeGasPrice.toNumber());
  });

  it('fast', async () => {
    expect((await gasPrice.fast()).toNumber()).toEqual(fakeGasPrice.toNumber());
  });
});
