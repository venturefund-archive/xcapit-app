import { IntersectedTokensFactory } from './intersected-tokens.factory';
import { DefaultTokens } from '../../tokens/tokens';
import { TokenRepo } from '../../token-repo/token-repo';
import { rawTokensData } from '../../fixtures/raw-tokens-data';

describe('IntersectedTokensFactory', () => {
  it('new', () => {
    expect(new IntersectedTokensFactory()).toBeTruthy();
  });

  it('create', () => {
    expect(
      new IntersectedTokensFactory().create(
        new DefaultTokens(new TokenRepo(rawTokensData)),
        new DefaultTokens(new TokenRepo(rawTokensData))
      )
    ).toBeTruthy();
  });
});
