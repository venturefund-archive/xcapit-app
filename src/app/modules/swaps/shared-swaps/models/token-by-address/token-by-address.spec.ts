import { rawTokensData } from "../fixtures/raw-tokens-data";
import { DefaultToken } from "../token/token";
import { TokenByAddress } from "./token-by-address";
import { TokenRepo } from "../token-repo/token-repo";
import { DefaultTokens } from "../tokens/tokens";


describe('Token By Address', () => {

  let tokenQuery: TokenByAddress;
  const token = new DefaultToken(rawTokensData[0]);
  const tokens = new DefaultTokens(new TokenRepo(rawTokensData));

  beforeEach(() => {
    tokenQuery = new TokenByAddress(token.address(), tokens);
  });

  it('new', () => {
    expect(tokenQuery).toBeTruthy();
  });

  it('value access', async () => {
    expect((await tokenQuery.value()).address()).toEqual(token.address());
  });
});
