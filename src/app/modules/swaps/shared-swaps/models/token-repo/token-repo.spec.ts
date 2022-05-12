import { rawTokensData } from "../fixtures/raw-tokens-data";
import { TokenRepo } from "./token-repo";


describe('TokenRepo', () => {

  it('new', () => {
    expect(new TokenRepo(rawTokensData)).toBeTruthy();
  });

  it('all', () => {
    expect(new TokenRepo(rawTokensData).all()).toBeTruthy();
  });
});
