import { FakeMenuCategories } from '../menu-categories/fake/fake-menu-categories';
import { rawMenuCategoryHelp } from '../menu-category.raw';
import { FakeMenuCategory } from '../menu-category/fake/fake-menu-category';
import { rawMenuItemCommunity, rawMenuItemSupport } from '../menu-item/menu-items.raw';
import { Menu } from './menu';

fdescribe('Menu', () => {
  let menu: Menu;
  const rawCategoryWithItems = { ...rawMenuCategoryHelp, items: [rawMenuItemSupport, rawMenuItemCommunity] };

  beforeEach(() => {
    menu = new Menu(new FakeMenuCategories([new FakeMenuCategory(rawCategoryWithItems)]));
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
    menu.hide(rawMenuCategoryHelp.name, rawMenuItemSupport.name);
    expect(menu.json()[0].items[0].visible).toBeFalse();
  });

  it('show', () => {
    menu.hide(rawMenuCategoryHelp.name, rawMenuItemSupport.name);
    expect(menu.json()[0].items[0].visible).toBeFalse();
    menu.show(rawMenuCategoryHelp.name, rawMenuItemSupport.name);
    expect(menu.json()[0].items[0].visible).toBeTrue();
  });

  it('hideCategory', () => {
    menu.hideCategory(rawMenuCategoryHelp.name);
    expect(menu.json()[0].visible).toBeTrue();
  });

  it('showCategory', () => {
    menu.hideCategory(rawMenuCategoryHelp.name);
    expect(menu.json()[0].visible).toBeFalse();
    menu.showCategory(rawMenuCategoryHelp.name);
    expect(menu.json()[0].visible).toBeTrue();
  });
});
