import { BlockchainRepo } from '../../blockchain-repo/blockchain-repo';
import { DefaultBlockchains } from '../../blockchains/default/default-blockchains';
import { rawBlockchainsData } from '../../fixtures/raw-blockchains-data';
import { OneInchBlockchainsOfFactory } from './one-inch-blockchains-of.factory';


describe('OneInchBlockchainsOfFactory', () => {
  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));
  let factory: OneInchBlockchainsOfFactory;

  beforeEach(() => {
    factory = new OneInchBlockchainsOfFactory();
  });

  it('new', () => {
    expect(factory).toBeTruthy();
  });

  it('create', () => {
    expect(factory.create(blockchains)).toBeTruthy();
  });
});
