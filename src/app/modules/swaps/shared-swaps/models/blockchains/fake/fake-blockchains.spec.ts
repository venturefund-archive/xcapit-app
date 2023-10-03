import { Blockchain } from '../../blockchain/blockchain';
import { rawEthereumData } from '../../fixtures/raw-blockchains-data';
import { Blockchains } from '../blockchains.interface';
import { FakeBlockchains } from './fake-blockchains';

describe('FakeBlockchains', () => {
  let fakeBlockchains: Blockchains;
  let blockchain: Blockchain;
  beforeEach(() => {
    blockchain = new Blockchain(rawEthereumData);
    fakeBlockchains = new FakeBlockchains([blockchain], blockchain, blockchain);
  });

  it('new', () => {
    expect(fakeBlockchains).toBeTruthy();
  });

  it('new with default', () => {
    expect(new FakeBlockchains()).toBeTruthy();
  });

  it('value', () => {
    expect(fakeBlockchains.value()).toEqual([blockchain]);
  });
  
  it('oneByName', () => {
    expect(fakeBlockchains.oneByName('aBlockchain')).toEqual(blockchain);
  });
  
  it('oneById', () => {
    expect(fakeBlockchains.oneById('anId')).toEqual(blockchain);
  });
});
