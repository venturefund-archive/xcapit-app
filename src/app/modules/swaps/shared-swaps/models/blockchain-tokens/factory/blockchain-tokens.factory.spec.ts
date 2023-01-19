import { DefaultBlockchain } from "../../blockchain/blockchain";
import { rawEthereumData } from "../../fixtures/raw-blockchains-data";
import { rawTokensData } from "../../fixtures/raw-tokens-data";
import { TokenRepo } from "../../token-repo/token-repo";
import { DefaultTokens } from "../../tokens/tokens";
import { BlockchainTokensFactory } from "./blockchain-tokens.factory";


describe('Blockchain Tokens Factory', () => {

  let blockchainTokensFactory: BlockchainTokensFactory;

  beforeEach(() => {
    blockchainTokensFactory = new BlockchainTokensFactory();
  });

  it('new', () => {
    expect(blockchainTokensFactory).toBeTruthy();
  });

  it('create', () => {
    const tokens = blockchainTokensFactory.create(
      new DefaultBlockchain(rawEthereumData),
      new DefaultTokens(new TokenRepo(rawTokensData))
    );

    expect(tokens).toBeTruthy();
  });

});
