import { BlockchainRepo } from '../blockchain-repo/blockchain-repo';
import { Blockchains } from '../blockchains/blockchains.interface';
import { DefaultBlockchains } from '../blockchains/default/default-blockchains';
import { rawBlockchainsData, rawEthereumData } from '../fixtures/raw-blockchains-data';
import { OneInchBlockchainsOf } from './one-inch-blockchains-of';

describe('OneInchBlockchainsOf', () => {
  let blockchains: Blockchains;
  const defaultBlockchains: Blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));

  beforeEach(() => {
    blockchains = new OneInchBlockchainsOf(defaultBlockchains, [rawEthereumData.id]);
  });

  it('new', () => {
    expect(blockchains).toBeTruthy();
  });

  it('value', () => {
    expect(blockchains.value().length).toEqual(1);
  });

  it('one by name', () => {
    expect(blockchains.oneByName(rawEthereumData.name).name()).toEqual(rawEthereumData.name);
  });
});
