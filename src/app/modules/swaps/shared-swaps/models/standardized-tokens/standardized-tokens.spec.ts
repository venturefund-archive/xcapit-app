import { rawMATICData } from "../fixtures/raw-tokens-data";
import { StandardizedTokens } from "./standardized-tokens";
import { TokenRepo } from "../token-repo/token-repo";
import { Tokens } from "../tokens/tokens";


describe('Standardized Tokens', () => {

  let tokens: Tokens;

  beforeEach(() => {
    tokens = new StandardizedTokens(new TokenRepo([rawMATICData]));
  });

  it('new', () => {
    expect(tokens).toBeTruthy();
  });

  it('value', async () => {
    expect((await tokens.value()).length).toBeGreaterThan(0);
  });

  it('access to an individual token', async () => {
    const token = (await tokens.value())[0];

    expect(token.symbol()).toEqual(rawMATICData.value);
  });

  it('access to an individual native token with standardized address', async () => {
    const token = (await tokens.value())[0];

    expect(token.address()).toEqual('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
  });
});
