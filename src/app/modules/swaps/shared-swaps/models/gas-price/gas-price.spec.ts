import { AmountOf } from '../amount-of/amount-of';
import { DefaultBlockchain } from '../blockchain/blockchain';
import { fakeRawGasPrice, fakeProviders } from '../fakes/fake-ethers-providers';
import { rawEthereumData } from '../fixtures/raw-blockchains-data';
import { DefaultGasPriceOf, GasPrice } from './gas-price';


describe('Default Gas Price', () => {

  let gasPrice: GasPrice;
  const blockchain = new DefaultBlockchain(rawEthereumData);
  const expectedAmount = new AmountOf(fakeRawGasPrice.toString(), blockchain.nativeToken());

  beforeEach(() => {
    gasPrice = new DefaultGasPriceOf(blockchain, fakeProviders);
  });

  it('new', () => {
    expect(gasPrice).toBeTruthy();
  });

  it('safeLow', async () => {
    expect((await gasPrice.safeLow()).value()).toEqual(expectedAmount.value());
  });

  it('standard', async () => {
    expect((await gasPrice.standard()).value()).toEqual(expectedAmount.value());
  });

  it('fast', async () => {
    expect((await gasPrice.fast()).value()).toEqual(expectedAmount.value());
  });
});
