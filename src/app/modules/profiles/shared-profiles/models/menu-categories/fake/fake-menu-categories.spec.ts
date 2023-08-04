import { FakeMenuCategories } from './fake-menu-categories';
import { FakeMenuCategory } from '../../menu-category/fake/fake-menu-category';

describe('FakeMenuCategories', () => {
  let fakeMenuCategories: FakeMenuCategories;
  const aCategoryName = 'aCategoryName';

  beforeEach(() => {
    fakeMenuCategories = new FakeMenuCategories([new FakeMenuCategory()]);
  });

  it('new', () => {
    expect(fakeMenuCategories).toBeTruthy();
  });

  it('show', () => {
    expect(fakeMenuCategories.show(aCategoryName)).toBeTruthy();
  });

  it('hide', () => {
    expect(fakeMenuCategories.hide(aCategoryName)).toBeTruthy();
  });

  it('withWalletConnectStatus', () => {
    expect(fakeMenuCategories.withWalletConnectStatus(true)).toBeTruthy();
  });
});
