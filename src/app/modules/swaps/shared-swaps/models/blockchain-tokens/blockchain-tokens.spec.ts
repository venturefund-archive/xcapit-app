import { BlockchainTokens } from "./blockchain-tokens";
import { Blockchain } from "../blockchain/blockchain";
import { rawEthereumData } from "../fixtures/raw-blockchains-data";
import { rawTokensData } from "../fixtures/raw-tokens-data";
import { TokenRepo } from "../token-repo/token-repo";
import { DefaultTokens, Tokens } from "../tokens/tokens";


describe('BlockchainTokens', () => {

  let tokens: Tokens;

  beforeEach(() => {
    tokens = new BlockchainTokens(
      new Blockchain(rawEthereumData),
      new DefaultTokens(new TokenRepo(rawTokensData)));
  });

  it('new', () => {
    expect(tokens).toBeTruthy();
  });

  it('value access', async () => {
    expect((await tokens.value()).length).toEqual(2);
  });
});
