import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { TokenPrices } from './token-prices';
import { BlockchainTokens } from 'src/app/modules/swaps/shared-swaps/models/blockchain-tokens/blockchain-tokens';
import { DefaultTokens, Tokens } from 'src/app/modules/swaps/shared-swaps/models/tokens/tokens';
import { DefaultBlockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { rawPolygonData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { TokenRepo } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { rawMATICData, rawTokensData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';

describe('TokenPrices', () => {
  let tokens: Tokens;
  let tokenPrices: TokenPrices;

  beforeEach(() => {
    tokens = new BlockchainTokens(new DefaultBlockchain(rawPolygonData), new DefaultTokens(new TokenRepo(rawTokensData)));
    tokenPrices = new TokenPrices(
      tokens,
      new FakeHttpClient({}, { prices: { USDC: 1, MATIC: 2 } }),
      'https://test.com/'
    );
  });

  it('should create', () => {
    expect(tokenPrices).toBeTruthy();
  });

  it('should create with default url', () => {
    expect(new TokenPrices(tokens, new FakeHttpClient({}, {}))).toBeTruthy();
  });

  it('should get value', async () => {
    expect(await tokenPrices.value()).toEqual({ USDC: 1, MATIC: 2 });
  });

  it('should get cached value', async () => {
    expect(await tokenPrices.value()).toEqual({ USDC: 1, MATIC: 2 });
    expect(await tokenPrices.value()).toEqual({ USDC: 1, MATIC: 2 });
  });

  it('should get value of a coin', async () => {
    expect(await tokenPrices.valueOf(rawMATICData)).toEqual(2);
  });
});
