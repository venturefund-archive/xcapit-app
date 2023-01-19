import { Blockchain, DefaultBlockchain } from '../blockchain/blockchain';
import { rawEthereumData, rawPolygonData } from '../fixtures/raw-blockchains-data';
import { BlockchainMM } from './blockchain-mm';


fdescribe('BlockchainMM', () => {
  let blockchain: Blockchain;

  beforeEach(() => {
    blockchain = new BlockchainMM(new DefaultBlockchain(rawPolygonData));
  });

  it('new', () => {
    expect(blockchain).toBeTruthy();
  });

  it('derived path', () => {
    expect(blockchain.derivedPath()).toEqual(rawEthereumData.derivedPath);
    expect(blockchain.derivedPath()).not.toEqual(rawPolygonData.derivedPath);
  });

  it('prop access', () => {
    expect(blockchain.id()).toEqual(rawPolygonData.id);
    expect(blockchain.name()).toEqual(rawPolygonData.name);
    expect(blockchain.rpc()).toEqual(rawPolygonData.rpc);
    expect(blockchain.json()).toEqual(rawPolygonData);
  });

  it('native token', () => {
    expect(blockchain.nativeToken().symbol()).toEqual(rawPolygonData.nativeToken.value);
    expect(blockchain.nativeToken().json().network).toEqual(rawPolygonData.name);
  });
});
