import { FakeMenuCategories } from './fake-menu-categories';
import { FakeMenuCategory } from '../../menu-category/fake/fake-menu-category';

fdescribe('FakeMenuCategories', () => {
  let fakeMenuCategories: FakeMenuCategories;

  beforeEach(() => {
    fakeMenuCategories = new FakeMenuCategories([new FakeMenuCategory()]);
  });

  it('new', () => {
    expect(fakeMenuCategories).toBeTruthy();
  });
});
