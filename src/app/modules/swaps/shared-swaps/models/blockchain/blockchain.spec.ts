import { Blockchain } from "./blockchain";
import { rawEthereumData } from "../fixtures/raw-blockchains-data";


describe('Blockchain', () => {

  let blockchain: Blockchain;

  beforeEach(() => {
    blockchain = new Blockchain(rawEthereumData);
  });

  it('new', () => {
    expect(blockchain).toBeTruthy();
  });

  it('prop access', () => {
    expect(blockchain.id()).toEqual(rawEthereumData.id);
    expect(blockchain.name()).toEqual(rawEthereumData.name);
    expect(blockchain.rpc()).toEqual(rawEthereumData.rpc);
    expect(blockchain.derivedPath()).toEqual(rawEthereumData.derivedPath);
    expect(blockchain.json()).toEqual(rawEthereumData);
    expect(blockchain.gasPriceClass()).toEqual(rawEthereumData.gasPrice);
  });

  it('native token', () => {
    expect(blockchain.nativeToken().symbol()).toEqual(rawEthereumData.nativeToken.value);
  });
});
