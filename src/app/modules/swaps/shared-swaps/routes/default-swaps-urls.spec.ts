import { DefaultSwapsUrls } from './default-swaps-urls';

describe('DefaultSwapsUrls', () => {
  let defaultSwapsUrls: DefaultSwapsUrls;

  beforeEach(() => {
    defaultSwapsUrls = new DefaultSwapsUrls();
  });

  it('new', () => {
    expect(defaultSwapsUrls).toBeTruthy();
  });

  it('home by a blockchain valid name', () => {
    expect(defaultSwapsUrls.homeByBlockchain('MATIC')).toBeTruthy();
  });

  it('home by a blockchain invalid name', () => {
    expect(defaultSwapsUrls.homeByBlockchain('xyx')).toBeFalsy();
  });

  it('home', () => {
    expect(defaultSwapsUrls.home()).toBeTruthy();
  });
});
