import { BlockchainRepo } from "../blockchain-repo/blockchain-repo";
import { Blockchains, DefaultBlockchains } from "./blockchains";
import { rawBlockchainsData } from "../fixtures/raw-blockchains-data";


describe('Blockchains', () => {

  let blockchains: Blockchains;

  beforeEach(() => {
    blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));
  });

  it('new', () => {
    expect(new DefaultBlockchains(new BlockchainRepo([]))).toBeTruthy();
  });

  it('value', () => {
    expect(blockchains.value().length).toBeGreaterThan(0);
  })

  it('access to an individual blockchain', () => {
    const blockchain = blockchains.value()[0];

    expect(blockchain.id()).toEqual(rawBlockchainsData[0].id);
  });

  it('by Name', () => {
    const aBlockchainName = rawBlockchainsData[0].name;

    expect(blockchains.oneByName(aBlockchainName).name()).toEqual(aBlockchainName);
  });

  it('by Id', () => {
    const aBlockchainId = rawBlockchainsData[0].id;

    expect(blockchains.oneById(aBlockchainId).id()).toEqual(aBlockchainId);
  });
});
