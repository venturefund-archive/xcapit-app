import { rawMenuItemCommunity, rawMenuItemSupport } from '../menu-item/menu-items.raw';
import { FakeMenuCategories } from '../menu-categories/fake/fake-menu-categories';
import { MenuCategories } from '../menu-categories/menu-categories.interface';
import { FakeMenuCategory } from '../menu-category/fake/fake-menu-category';
import { rawMenuCategoryHelp } from '../menu-category.raw';
import { Menu } from './menu';

describe('Menu', () => {
  let menu: Menu;
  let fakeMenuCategories: MenuCategories;
  const rawCategoryWithItems = { ...rawMenuCategoryHelp, items: [rawMenuItemSupport, rawMenuItemCommunity] };

  beforeEach(() => {
    fakeMenuCategories = new FakeMenuCategories([new FakeMenuCategory(rawCategoryWithItems)]);
    menu = new Menu(fakeMenuCategories);
  });

  it('new', () => {
    expect(menu).toBeTruthy();
  });

  it('new with default', () => {
    expect(new Menu()).toBeTruthy();
  });

  it('json', () => {
    expect(menu.json()).toEqual([rawCategoryWithItems]);
  });

  it('hide', () => {
    expect(menu.hide(rawMenuCategoryHelp.name, rawMenuItemSupport.name)).toBeTruthy();
  });

  it('show', () => {
    expect(menu.show(rawMenuCategoryHelp.name, rawMenuItemSupport.name)).toBeTruthy();
  });
});
