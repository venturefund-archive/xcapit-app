import { rawTokensData } from "../fixtures/raw-tokens-data";
import { TokenRepo } from "../token-repo/token-repo";
import { DefaultTokens, Tokens } from "./tokens";


describe('Tokens', () => {

  let tokens: Tokens;

  beforeEach(() => {
    tokens = new DefaultTokens(new TokenRepo(rawTokensData));
  });

  it('new', () => {
    expect(new DefaultTokens(new TokenRepo([]))).toBeTruthy();
  });

  it('value', async () => {
    expect((await tokens.value()).length).toBeGreaterThan(0);
  });

  it('access to an individual token', async () => {
    const token = (await tokens.value())[0];

    expect(token.symbol()).toEqual(rawTokensData[0].value);
  });
});
