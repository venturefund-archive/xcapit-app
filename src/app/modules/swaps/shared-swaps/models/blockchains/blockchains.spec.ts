import { BlockchainRepo } from "../blockchain-repo/blockchain-repo";
import { Blockchains } from "./blockchains";
import { rawBlockchainsData } from "../fixtures/raw-blockchains-data";


describe('Blockchains', () => {

  let blockchains: Blockchains;

  beforeEach(() => {
    blockchains = new Blockchains(new BlockchainRepo(rawBlockchainsData));
  });

  it('new', () => {
    expect(new Blockchains(new BlockchainRepo([]))).toBeTruthy();
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
  })
});
