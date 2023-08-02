import { FakeMenuCategory } from './fake-menu-category';
import { rawMenuCategoryHelp } from '../../menu-category.raw';

fdescribe('FakeMenuCategory', () => {
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
});
