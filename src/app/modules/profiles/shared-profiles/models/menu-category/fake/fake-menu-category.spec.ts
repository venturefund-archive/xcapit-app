import { FakeMenuCategory } from './fake-menu-category';
import { rawMenuCategoryHelp } from '../../menu-category.raw';

describe('FakeMenuCategory', () => {
  let fakeMenuCategory: FakeMenuCategory;

  beforeEach(() => {
    fakeMenuCategory = new FakeMenuCategory();
  });

  it('new', () => {
    expect(fakeMenuCategory).toBeTruthy();
  });

  it('json', () => {
    expect(fakeMenuCategory.json()).toEqual(rawMenuCategoryHelp);
  });

  it('name', () => {
    expect(fakeMenuCategory.name()).toEqual(rawMenuCategoryHelp.name);
  });

  it('position', () => {
    expect(fakeMenuCategory.position()).toEqual(rawMenuCategoryHelp.position);
  });

  it('show', () => {
    expect(fakeMenuCategory.show()).toBeTruthy();
  });

  it('hide', () => {
    expect(fakeMenuCategory.hide()).toBeTruthy();
  });

  it('setWalletConnectStatus', () => {
    expect(fakeMenuCategory.setWalletConnectStatus(true)).toBeTruthy();
  });
});
