import { BlockchainRepo } from './blockchain-repo';
import { rawBlockchainsData } from '../fixtures/raw-blockchains-data';


describe('BlockchainRepo', () => {

  let repo: BlockchainRepo;

  beforeEach(() => {
    repo = new BlockchainRepo(rawBlockchainsData);
  });

  it('new', () => {
    expect(repo).toBeTruthy();
  });

  it('all', () => {
    expect(repo.all()).toBeTruthy();
  });

  it('by Name', () => {
    const aBlockchainName = rawBlockchainsData[0].name;

    expect(repo.byName(aBlockchainName)).toBeTruthy();
  });
});