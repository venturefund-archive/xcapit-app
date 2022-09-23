import { TokenDetailInjectable } from './token-detail.injectable';

describe('TokenDetailInjectable', () => {
  it('new', () => {
    expect(new TokenDetailInjectable(null)).toBeTruthy();
  });

  it('create', () => {
    expect(new TokenDetailInjectable(null).create(null, null, null, null)).toBeTruthy();
  });
});
