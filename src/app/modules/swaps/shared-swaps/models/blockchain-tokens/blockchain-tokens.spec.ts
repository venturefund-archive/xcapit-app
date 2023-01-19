import { BlockchainTokens } from './blockchain-tokens';
import { DefaultBlockchain } from '../blockchain/blockchain';
import { rawEthereumData, rawSolanaData } from '../fixtures/raw-blockchains-data';
import { rawTokensData, rawSAMOData } from '../fixtures/raw-tokens-data';
import { TokenRepo } from '../token-repo/token-repo';
import { DefaultTokens, Tokens } from '../tokens/tokens';

describe('BlockchainTokens', () => {
  let tokens: Tokens;

  beforeEach(() => {
    tokens = new BlockchainTokens(new DefaultBlockchain(rawEthereumData), new DefaultTokens(new TokenRepo(rawTokensData)));
  });

  it('new', () => {
    expect(tokens).toBeTruthy();
  });

  it('value access', async () => {
    expect((await tokens.value()).length).toEqual(2);
  });

  it('value access when solana', async () => {
    tokens = new BlockchainTokens(new DefaultBlockchain(rawSolanaData), new DefaultTokens(new TokenRepo(rawTokensData)));
    expect((await tokens.value())[1].address()).toEqual(rawSAMOData.contract);
  });
});
