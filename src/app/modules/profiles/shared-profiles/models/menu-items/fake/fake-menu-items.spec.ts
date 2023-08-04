import { MenuItems } from '../menu-items.interface';
import { FakeMenuItems } from './fake-menu-items';

describe('FakeMenuItems', () => {
  let fakeMenuItems: MenuItems;
  const aCategoryName = 'aCategoryName';
  const anItemName = 'anItemName';

  beforeEach(() => {
    fakeMenuItems = new FakeMenuItems();
  });

  it('new', () => {
    expect(fakeMenuItems).toBeTruthy();
  });

  it('byCategory', () => {
    expect(fakeMenuItems.byCategory(aCategoryName)).toEqual([]);
  });

  it('hide', () => {
    expect(fakeMenuItems.hide(aCategoryName)).toEqual(new FakeMenuItems());
  });

  it('show', () => {
    expect(fakeMenuItems.show(aCategoryName)).toEqual(new FakeMenuItems());
  });
  it('hide item', () => {
    expect(fakeMenuItems.hide(aCategoryName, anItemName)).toEqual(new FakeMenuItems());
  });

  it('show item', () => {
    expect(fakeMenuItems.show(aCategoryName, anItemName)).toEqual(new FakeMenuItems());
  });
});
