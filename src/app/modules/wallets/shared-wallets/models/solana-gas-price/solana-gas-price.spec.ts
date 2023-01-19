import { AmountOf } from 'src/app/modules/swaps/shared-swaps/models/amount-of/amount-of';
import { DefaultBlockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { fakeRawGasPrice } from 'src/app/modules/swaps/shared-swaps/models/fakes/fake-ethers-providers';
import { rawSolanaData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { GasPrice } from 'src/app/modules/swaps/shared-swaps/models/gas-price/gas-price';
import { SolanaGasPrice } from './solana-gas-price';


describe('SolanaGasPrice', () => {
  let gasPrice: GasPrice;
  const lamportsPerSOL = 10000000;
  const blockchain = new DefaultBlockchain(rawSolanaData);
  const expectedAmount = new AmountOf(fakeRawGasPrice.toString(), blockchain.nativeToken());

  beforeEach(() => {
    gasPrice = new SolanaGasPrice(blockchain, lamportsPerSOL);
  });

  it('new', () => {
    expect(new SolanaGasPrice(blockchain)).toBeTruthy();
  });

  it('price values', async () => {
    expect(await gasPrice.fast()).toEqual(expectedAmount);
    expect(await gasPrice.safeLow()).toEqual(expectedAmount);
    expect(await gasPrice.standard()).toEqual(expectedAmount);
  });
});
