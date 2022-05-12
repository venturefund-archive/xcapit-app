import { Blockchain } from "./blockchain";
import { rawEthereumData } from "../fixtures/raw-blockchains-data";


describe('Blockchain', () => {

  it('new', () => {
    expect(new Blockchain(rawEthereumData)).toBeTruthy();
  });

  it('prop access', () => {
    const blockchain = new Blockchain(rawEthereumData);

    expect(blockchain.name()).toEqual(rawEthereumData.name);
    expect(blockchain.rpc()).toEqual(rawEthereumData.rpc);
    expect(blockchain.derivedPath()).toEqual(rawEthereumData.derivedPath);
    expect(blockchain.json()).toEqual(rawEthereumData);
  });
});
