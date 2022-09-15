import { rawMATICData } from '../fixtures/raw-tokens-data';
import { DefaultToken } from '../token/token';
import { FixedTokens } from './fixed-tokens';

describe('FixedTokens', () => {
  let tokensOf: FixedTokens;

  beforeEach(() => {
    tokensOf = new FixedTokens([new DefaultToken(rawMATICData)]);
  });

  it('new', () => {
    expect(tokensOf).toBeTruthy();
  });

  it('value', async () => {
    const tokensValue = await tokensOf.value();

    expect(tokensValue.length).toEqual(1);
    expect(tokensValue[0].address()).toEqual(rawMATICData.contract);
  });
});
